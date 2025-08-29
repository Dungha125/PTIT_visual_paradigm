import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Share project with user
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
    const { email, permission } = await request.json();

    // Verify project exists and user is owner
    const project = await prisma.project.findFirst({
      where: {
        id: projectId,
        userId: session.user.id
      }
    });

    if (!project) {
      return NextResponse.json({ error: 'Project not found or access denied' }, { status: 404 });
    }

    // Find user by email
    const targetUser = await prisma.user.findUnique({
      where: { email }
    });

    if (!targetUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    if (targetUser.id === session.user.id) {
      return NextResponse.json({ error: 'Cannot share with yourself' }, { status: 400 });
    }

    // Check if already shared
    const existingShare = await prisma.projectShare.findFirst({
      where: {
        projectId,
        userId: targetUser.id
      }
    });

    if (existingShare) {
      // Update existing share
      await prisma.projectShare.update({
        where: { id: existingShare.id },
        data: {
          permission,
          isActive: true
        }
      });
    } else {
      // Create new share
      await prisma.projectShare.create({
        data: {
          projectId,
          userId: targetUser.id,
          permission,
          invitedBy: session.user.id
        }
      });
    }

            // Record activity
        await prisma.projectActivity.create({
          data: {
            projectId,
            userId: session.user.id,
            action: 'share',
            details: JSON.stringify({ 
              sharedWith: targetUser.email, 
              permission 
            })
          }
        });

        // Create notification for the user being shared with
        await prisma.notification.create({
          data: {
            userId: targetUser.id,
            type: 'share',
            title: 'Project được chia sẻ',
            message: `${session.user.name || session.user.email} đã chia sẻ project "${project.title}" với bạn`,
            projectId: project.id,
            projectTitle: project.title,
            actionUrl: `/uml-designer?project=${project.id}`
          }
        });

        return NextResponse.json({ 
          message: 'Project shared successfully',
          sharedWith: targetUser.email,
          permission
        });

  } catch (error) {
    console.error('Error sharing project:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// Get project shares
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

    // Get all shares for this project
    const shares = await prisma.projectShare.findMany({
      where: { projectId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true
          }
        }
      },
      orderBy: { invitedAt: 'desc' }
    });

    return NextResponse.json({ shares });

  } catch (error) {
    console.error('Error getting project shares:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
