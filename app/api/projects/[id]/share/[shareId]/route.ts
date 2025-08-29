import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Update share permission
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string; shareId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id: projectId, shareId } = params;
    const { permission } = await request.json();

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

    // Update share permission
    const updatedShare = await prisma.projectShare.update({
      where: {
        id: shareId,
        projectId
      },
      data: {
        permission
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
        action: 'permission-updated',
        details: JSON.stringify({ 
          sharedWith: updatedShare.user.email, 
          newPermission: permission 
        })
      }
    });

    return NextResponse.json({ 
      message: 'Permission updated successfully',
      share: updatedShare
    });

  } catch (error) {
    console.error('Error updating share permission:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// Delete share
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string; shareId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id: projectId, shareId } = params;

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

    // Get share info before deleting for activity log
    const shareToDelete = await prisma.projectShare.findUnique({
      where: { id: shareId },
      include: {
        user: {
          select: {
            email: true
          }
        }
      }
    });

    if (!shareToDelete) {
      return NextResponse.json({ error: 'Share not found' }, { status: 404 });
    }

    // Delete share
    await prisma.projectShare.delete({
      where: {
        id: shareId,
        projectId
      }
    });

    // Record activity
    await prisma.projectActivity.create({
      data: {
        projectId,
        userId: session.user.id,
        action: 'share-removed',
        details: JSON.stringify({ 
          removedUser: shareToDelete.user.email 
        })
      }
    });

    return NextResponse.json({ 
      message: 'Share removed successfully'
    });

  } catch (error) {
    console.error('Error removing share:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
