import prisma from "../config/prisma.js";

export function getNotifications(userId: string) {
  return prisma.notification.findMany({
    where: {
      userId,
    },

    orderBy: {
      createdAt: "desc",
    },
  });
}

export function markAsRead(id: string, userId: string) {
  return prisma.notification.updateMany({
    where: {
      id,
      userId,
    },

    data: {
      isRead: true,
    },
  });
}

export function markAllAsRead(userId: string) {
  return prisma.notification.updateMany({
    where: {
      userId,
      isRead: false,
    },

    data: {
      isRead: true,
    },
  });
}

export function createNotification(data: {
  userId: string;
  jobId?: string;
  title: string;
  message: string;
  type: "FOLLOW_UP" | "INTERVIEW" | "JOB_STATUS" | "SYSTEM";
  actionUrl?: string;
  reminderDate?: Date;
}) {
  return prisma.notification.create({
    data,
  });
}

export function findNotification(
  userId: string,
  jobId: string,
  type: "FOLLOW_UP" | "INTERVIEW" | "JOB_STATUS" | "SYSTEM",
  reminderDate: Date,
) {
  return prisma.notification.findFirst({
    where: {
      userId,
      jobId,
      type,
      reminderDate,
    },
  });
}

export function getInterviewReminders(userId: string) {
  return prisma.interview.findMany({
    where: {
      completed: false,

      job: {
        userId,
      },
    },

    include: {
      job: {
        select: {
          id: true,
          company: true,
          jobTitle: true,
        },
      },
    },
  });
}

export function getFollowUpReminders(userId: string) {
  return prisma.job.findMany({
    where: {
      userId,

      followUpDone: false,

      followUpDate: {
        not: null,
      },
    },
  });
}

export function getUsersForNotificationScheduler() {
  return prisma.user.findMany({
    where: {
      isActive: true,
      OR: [
        {
          followUpReminders: true,
        },
        {
          interviewReminders: true,
        },
      ],
    },

    select: {
      id: true,
      followUpReminders: true,
      interviewReminders: true,
    },
  });
}

export function getUserNotificationSettings(userId: string) {
  return prisma.user.findUnique({
    where: {
      id: userId,
    },
    select: {
      email: true,
      emailNotifications: true,
    },
  });
}
