import { generateNotifications } from "./notifications.service.js";
import { getUsersForNotificationScheduler } from "../repositories/notifications.repository.js";

export async function runNotificationScheduler() {
  const users = await getUsersForNotificationScheduler();

  for (const user of users) {
    await generateNotifications(user.id, {
      followUpReminders: user.followUpReminders,
      interviewReminders: user.interviewReminders,
    });
  }

  console.log(
    `[Scheduler] Processed notifications for ${users.length} user(s).`,
  );
}
