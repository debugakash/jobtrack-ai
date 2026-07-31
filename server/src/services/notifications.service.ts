import {
  createNotification,
  findNotification,
  getFollowUpReminders,
  getInterviewReminders,
  getNotifications,
  markAllAsRead,
  markAsRead,
} from "../repositories/notifications.repository.js";

import { differenceInCalendarDays, startOfDay } from "date-fns";

export async function getNotificationsService(userId: string) {
  await generateNotifications(userId);

  return getNotifications(userId);
}

export function markNotificationReadService(id: string, userId: string) {
  return markAsRead(id, userId);
}

export function markAllNotificationsReadService(userId: string) {
  return markAllAsRead(userId);
}

export async function generateNotifications(userId: string) {
  const interviews = await getInterviewReminders(userId);

  const followUps = await getFollowUpReminders(userId);

  const today = startOfDay(new Date());

  for (const interview of interviews) {
    const interviewDate = startOfDay(interview.scheduledAt);

    const diff = differenceInCalendarDays(interviewDate, today);

    let title = "";
    let message = "";

    if (diff === 0) {
      title = "Interview Today";

      message = `${interview.job.company} interview is scheduled today.`;
    } else if (diff === 1) {
      title = "Interview Tomorrow";

      message = `${interview.job.company} interview is tomorrow.`;
    } else {
      continue;
    }

    const exists = await findNotification(userId, title, message);

    if (!exists) {
      await createNotification({
        userId,
        title,
        message,
        type: "INTERVIEW",
        actionUrl: `/jobs/${interview.job.id}`,
      });
    }
  }

  for (const job of followUps) {
    if (!job.followUpDate) continue;

    const followUpDate = startOfDay(job.followUpDate);

    const diff = differenceInCalendarDays(followUpDate, today);

    let title = "";
    let message = "";

    if (diff < 0) {
      title = "Follow-up Overdue";

      message = `Follow up with ${job.company} for ${job.jobTitle}.`;
    } else if (diff === 0) {
      title = "Follow-up Today";

      message = `Today is the follow-up day for ${job.company}.`;
    } else {
      continue;
    }

    const exists = await findNotification(userId, title, message);

    if (!exists) {
      await createNotification({
        userId,
        title,
        message,
        type: "FOLLOW_UP",
        actionUrl: `/jobs/${job.id}`,
      });
    }
  }
}
