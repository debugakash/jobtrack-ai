import {
  createNotification,
  findNotification,
  getFollowUpReminders,
  getInterviewReminders,
  getNotifications,
  getUserNotificationSettings,
  markAllAsRead,
  markAsRead,
} from "../repositories/notifications.repository.js";

import { differenceInCalendarDays, startOfDay } from "date-fns";
import { sendEmail } from "./email.service.js";

export async function getNotificationsService(userId: string) {
  return getNotifications(userId);
}

export function markNotificationReadService(id: string, userId: string) {
  return markAsRead(id, userId);
}

export function markAllNotificationsReadService(userId: string) {
  return markAllAsRead(userId);
}

export async function generateNotifications(
  userId: string,
  preferences?: {
    followUpReminders: boolean;
    interviewReminders: boolean;
  },
) {
  const followUpRemindersEnabled = preferences?.followUpReminders ?? true;
  const interviewRemindersEnabled = preferences?.interviewReminders ?? true;

  const emailSettings = await getUserNotificationSettings(userId);

  const emailNotificationsEnabled = emailSettings?.emailNotifications ?? false;

  const today = startOfDay(new Date());

  // -----------------------------------
  // Interview reminders
  // -----------------------------------

  if (interviewRemindersEnabled) {
    const interviews = await getInterviewReminders(userId);

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

      const reminderDate = interviewDate;

      const exists = await findNotification(
        userId,
        interview.job.id,
        "INTERVIEW",
        reminderDate,
      );

      if (!exists) {
        await createNotification({
          userId,
          jobId: interview.job.id,
          title,
          message,
          type: "INTERVIEW",
          actionUrl: `/jobs/${interview.job.id}`,
          reminderDate,
        });

        if (emailNotificationsEnabled && emailSettings?.email) {
          await sendEmail({
            to: emailSettings.email,
            subject: title,
            html: `
              <h2>${title}</h2>
              <p>${message}</p>
              <p>
                Open JobTrack AI to view more details.
              </p>
            `,
          });
        }
      }
    }
  }

  // -----------------------------------
  // Follow-up reminders
  // -----------------------------------

  if (followUpRemindersEnabled) {
    const followUps = await getFollowUpReminders(userId);

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

      // IMPORTANT:
      // For overdue reminders we use TODAY as the reminder date.
      //
      // This means:
      //
      // July 30 → one overdue notification
      // July 31 → another overdue notification
      // Aug 1   → another overdue notification
      //
      // But the same day cannot generate duplicates.
      const reminderDate = today;

      const exists = await findNotification(
        userId,
        job.id,
        "FOLLOW_UP",
        reminderDate,
      );

      if (!exists) {
        await createNotification({
          userId,
          jobId: job.id,
          title,
          message,
          type: "FOLLOW_UP",
          actionUrl: `/jobs/${job.id}`,
          reminderDate,
        });

        if (emailNotificationsEnabled && emailSettings?.email) {
          await sendEmail({
            to: emailSettings.email,
            subject: title,
            html: `
        <h2>${title}</h2>
        <p>${message}</p>
        <p>
          Open JobTrack AI to view more details.
        </p>
      `,
          });
        }
      }
    }
  }
}
