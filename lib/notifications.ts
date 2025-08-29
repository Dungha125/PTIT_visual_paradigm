import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export interface CreateNotificationData {
  userId: string;
  type: 'share' | 'comment' | 'edit' | 'permission' | 'system';
  title: string;
  message: string;
  projectId?: string;
  projectTitle?: string;
  actionUrl?: string;
}

export async function createNotification(data: CreateNotificationData) {
  try {
    const notification = await prisma.notification.create({
      data: {
        userId: data.userId,
        type: data.type,
        title: data.title,
        message: data.message,
        projectId: data.projectId,
        projectTitle: data.projectTitle,
        actionUrl: data.actionUrl
      }
    });

    return notification;
  } catch (error) {
    console.error('Error creating notification:', error);
    return null;
  }
}

export async function createProjectShareNotification(
  projectOwnerId: string,
  sharedWithUserId: string,
  projectId: string,
  projectTitle: string,
  sharedByUserName: string,
  permission: string
) {
  return createNotification({
    userId: sharedWithUserId,
    type: 'share',
    title: 'Project được chia sẻ',
    message: `${sharedByUserName} đã chia sẻ project "${projectTitle}" với bạn (Quyền: ${permission})`,
    projectId,
    projectTitle,
    actionUrl: `/uml-designer?project=${projectId}`
  });
}

export async function createCommentNotification(
  projectOwnerId: string,
  commenterUserId: string,
  projectId: string,
  projectTitle: string,
  commenterName: string,
  commentContent: string
) {
  const notifications = [];

  // Notify project owner if different from commenter
  if (projectOwnerId !== commenterUserId) {
    notifications.push(
      createNotification({
        userId: projectOwnerId,
        type: 'comment',
        title: 'Comment mới',
        message: `${commenterName} đã thêm comment vào project "${projectTitle}"`,
        projectId,
        projectTitle,
        actionUrl: `/uml-designer?project=${projectId}`
      })
    );
  }

  // Get other users with access to notify them
  const projectShares = await prisma.projectShare.findMany({
    where: {
      projectId,
      userId: { not: commenterUserId },
      isActive: true
    }
  });

  for (const share of projectShares) {
    notifications.push(
      createNotification({
        userId: share.userId,
        type: 'comment',
        title: 'Comment mới',
        message: `${commenterName} đã thêm comment vào project "${projectTitle}"`,
        projectId,
        projectTitle,
        actionUrl: `/uml-designer?project=${projectId}`
      })
    );
  }

  return Promise.all(notifications);
}

export async function createPermissionUpdateNotification(
  userId: string,
  projectId: string,
  projectTitle: string,
  updatedBy: string,
  newPermission: string
) {
  return createNotification({
    userId,
    type: 'permission',
    title: 'Quyền truy cập được cập nhật',
    message: `${updatedBy} đã cập nhật quyền truy cập của bạn thành "${newPermission}" cho project "${projectTitle}"`,
    projectId,
    projectTitle,
    actionUrl: `/uml-designer?project=${projectId}`
  });
}

export async function createProjectEditNotification(
  projectOwnerId: string,
  editorUserId: string,
  projectId: string,
  projectTitle: string,
  editorName: string
) {
  const notifications = [];

  // Notify project owner if different from editor
  if (projectOwnerId !== editorUserId) {
    notifications.push(
      createNotification({
        userId: projectOwnerId,
        type: 'edit',
        title: 'Project được chỉnh sửa',
        message: `${editorName} đã chỉnh sửa project "${projectTitle}"`,
        projectId,
        projectTitle,
        actionUrl: `/uml-designer?project=${projectId}`
      })
    );
  }

  // Get other users with access to notify them
  const projectShares = await prisma.projectShare.findMany({
    where: {
      projectId,
      userId: { not: editorUserId },
      isActive: true
    }
  });

  for (const share of projectShares) {
    notifications.push(
      createNotification({
        userId: share.userId,
        type: 'edit',
        title: 'Project được chỉnh sửa',
        message: `${editorName} đã chỉnh sửa project "${projectTitle}"`,
        projectId,
        projectTitle,
        actionUrl: `/uml-designer?project=${projectId}`
      })
    );
  }

  return Promise.all(notifications);
}
