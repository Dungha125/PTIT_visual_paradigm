import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Get project comments
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id: projectId } = params;

    // Verify project exists and user has access
    const project = await prisma.project.findFirst({
      where: {
        id: projectId,
        OR: [
          { userId: session.user.id },
          { shares: { some: { userId: session.user.id, isActive: true } } }
        ]
      }
    });

    if (!project) {
      return NextResponse.json({ error: 'Project not found or access denied' }, { status: 404 });
    }

    // Get all comments for this project
    const comments = await prisma.projectComment.findMany({
      where: { 
        projectId,
        parentId: null // Only top-level comments
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true
          }
        },
        replies: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                image: true
              }
            }
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json({ comments });

  } catch (error) {
    console.error('Error getting project comments:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// Add comment to project
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id: projectId } = params;
    const { content, parentId } = await request.json();

    if (!content || content.trim().length === 0) {
      return NextResponse.json({ error: 'Comment content is required' }, { status: 400 });
    }

    // Verify project exists and user has comment permission
    const project = await prisma.project.findFirst({
      where: {
        id: projectId,
        OR: [
          { userId: session.user.id },
          { shares: { some: { 
            userId: session.user.id, 
            permission: { in: ['COMMENT', 'EDIT'] }, 
            isActive: true 
          } } }
        ]
      }
    });

    if (!project) {
      return NextResponse.json({ error: 'Project not found or access denied' }, { status: 404 });
    }

    // If replying to a comment, verify parent comment exists
    if (parentId) {
      const parentComment = await prisma.projectComment.findFirst({
        where: {
          id: parentId,
          projectId
        }
      });

      if (!parentComment) {
        return NextResponse.json({ error: 'Parent comment not found' }, { status: 404 });
      }
    }

    // Create comment
    const comment = await prisma.projectComment.create({
      data: {
        projectId,
        userId: session.user.id,
        content: content.trim(),
        parentId
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true
          }
        }
      }
    });

            // Record activity
        await prisma.projectActivity.create({
          data: {
            projectId,
            userId: session.user.id,
            action: 'comment',
            details: JSON.stringify({ commentId: comment.id })
          }
        });

        // Get project owner and other users to notify
        const projectWithShares = await prisma.project.findUnique({
          where: { id: projectId },
          include: {
            user: true,
            shares: {
              where: { isActive: true },
              include: { user: true }
            }
          }
        });

        if (projectWithShares) {
          // Notify project owner (if not the same user)
          if (projectWithShares.userId !== session.user.id) {
            await prisma.notification.create({
              data: {
                userId: projectWithShares.userId,
                type: 'comment',
                title: 'Comment mới',
                message: `${session.user.name || session.user.email} đã thêm comment vào project "${projectWithShares.title}"`,
                projectId: projectWithShares.id,
                projectTitle: projectWithShares.title,
                actionUrl: `/uml-designer?project=${projectWithShares.id}`
              }
            });
          }

          // Notify other users with access to the project
          for (const share of projectWithShares.shares) {
            if (share.userId !== session.user.id) {
              await prisma.notification.create({
                data: {
                  userId: share.userId,
                  type: 'comment',
                  title: 'Comment mới',
                  message: `${session.user.name || session.user.email} đã thêm comment vào project "${projectWithShares.title}"`,
                  projectId: projectWithShares.id,
                  projectTitle: projectWithShares.title,
                  actionUrl: `/uml-designer?project=${projectWithShares.id}`
                }
              });
            }
          }
        }

        return NextResponse.json({ 
          message: 'Comment added successfully',
          comment
        });

  } catch (error) {
    console.error('Error adding comment:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
