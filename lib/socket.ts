import { Server as NetServer } from 'http';
import { Server as SocketIOServer } from 'socket.io';
import { NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export type NextApiResponseServerIO = NextApiResponse & {
  socket: any & {
    server: NetServer & {
      io: SocketIOServer;
    };
  };
};

export const config = {
  api: {
    bodyParser: false,
  },
};

export const initSocket = (server: NetServer) => {
  const io = new SocketIOServer(server, {
    cors: {
      origin: process.env.NEXTAUTH_URL || "http://localhost:3000",
      methods: ["GET", "POST"],
    },
  });

  // Store active users in each project
  const projectUsers = new Map<string, Set<string>>();

  io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    // Join project room
    socket.on('join-project', async (data: { projectId: string; userId: string }) => {
      const { projectId, userId } = data;
      
      // Verify user has access to project
      try {
        const project = await prisma.project.findFirst({
          where: {
            OR: [
              { userId: userId },
              { shares: { some: { userId: userId, isActive: true } } }
            ],
            id: projectId
          }
        });

        if (!project) {
          socket.emit('error', { message: 'Access denied' });
          return;
        }

        // Join project room
        socket.join(projectId);
        
        // Track user in project
        if (!projectUsers.has(projectId)) {
          projectUsers.set(projectId, new Set());
        }
        projectUsers.get(projectId)!.add(userId);

        // Notify others in project
        socket.to(projectId).emit('user-joined', { userId, projectId });
        
        // Send current users in project
        const currentUsers = Array.from(projectUsers.get(projectId) || []);
        socket.emit('project-users', currentUsers);

        // Update collaboration session
        await prisma.collaborationSession.upsert({
          where: { sessionId: socket.id },
          update: { lastSeen: new Date(), isActive: true },
          create: {
            sessionId: socket.id,
            projectId,
            userId,
            isActive: true
          }
        });

        console.log(`User ${userId} joined project ${projectId}`);
      } catch (error) {
        console.error('Error joining project:', error);
        socket.emit('error', { message: 'Failed to join project' });
      }
    });

    // Handle project updates
    socket.on('project-update', async (data: { 
      projectId: string; 
      userId: string; 
      content: string; 
      version: number;
      action: string;
    }) => {
      const { projectId, userId, content, version, action } = data;
      
      try {
        // Verify user has edit permission
        const project = await prisma.project.findFirst({
          where: {
            id: projectId,
            OR: [
              { userId: userId },
              { shares: { some: { userId: userId, permission: 'EDIT', isActive: true } } }
            ]
          }
        });

        if (!project) {
          socket.emit('error', { message: 'Edit permission denied' });
          return;
        }

        // Update project content
        await prisma.project.update({
          where: { id: projectId },
          data: {
            content,
            version: version + 1,
            lastEditAt: new Date(),
            lastEditBy: userId
          }
        });

        // Record activity
        await prisma.projectActivity.create({
          data: {
            projectId,
            userId,
            action,
            details: JSON.stringify({ version: version + 1 })
          }
        });

        // Broadcast update to other users in project
        socket.to(projectId).emit('project-updated', {
          projectId,
          userId,
          content,
          version: version + 1,
          action,
          timestamp: new Date()
        });

        console.log(`Project ${projectId} updated by user ${userId}`);
      } catch (error) {
        console.error('Error updating project:', error);
        socket.emit('error', { message: 'Failed to update project' });
      }
    });

    // Handle comments
    socket.on('add-comment', async (data: {
      projectId: string;
      userId: string;
      content: string;
      parentId?: string;
    }) => {
      const { projectId, userId, content, parentId } = data;
      
      try {
        // Verify user has comment permission
        const project = await prisma.project.findFirst({
          where: {
            id: projectId,
            OR: [
              { userId: userId },
              { shares: { some: { 
                userId: userId, 
                permission: { in: ['COMMENT', 'EDIT'] }, 
                isActive: true 
              } } }
            ]
          }
        });

        if (!project) {
          socket.emit('error', { message: 'Comment permission denied' });
          return;
        }

        // Create comment
        const comment = await prisma.projectComment.create({
          data: {
            projectId,
            userId,
            content,
            parentId
          },
          include: {
            user: {
              select: { id: true, name: true, image: true }
            }
          }
        });

        // Record activity
        await prisma.projectActivity.create({
          data: {
            projectId,
            userId,
            action: 'comment',
            details: JSON.stringify({ commentId: comment.id })
          }
        });

        // Broadcast comment to all users in project
        io.to(projectId).emit('comment-added', comment);
        
        console.log(`Comment added to project ${projectId} by user ${userId}`);
      } catch (error) {
        console.error('Error adding comment:', error);
        socket.emit('error', { message: 'Failed to add comment' });
      }
    });

    // Handle user presence
    socket.on('user-typing', (data: { projectId: string; userId: string; isTyping: boolean }) => {
      socket.to(data.projectId).emit('user-typing', data);
    });

    socket.on('user-cursor', (data: { projectId: string; userId: string; position: any }) => {
      socket.to(data.projectId).emit('user-cursor', data);
    });

    // Handle disconnection
    socket.on('disconnect', async () => {
      console.log('User disconnected:', socket.id);
      
      try {
        // Update collaboration session
        await prisma.collaborationSession.updateMany({
          where: { sessionId: socket.id },
          data: { isActive: false }
        });

        // Remove user from project tracking
        for (const [projectId, users] of projectUsers.entries()) {
          if (users.has(socket.id)) {
            users.delete(socket.id);
            socket.to(projectId).emit('user-left', { userId: socket.id, projectId });
            break;
          }
        }
      } catch (error) {
        console.error('Error handling disconnect:', error);
      }
    });
  });

  return io;
};
