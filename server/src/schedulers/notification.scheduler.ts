import cron, { type ScheduledTask } from "node-cron";

import { runNotificationScheduler } from "../services/notification-scheduler.service.js";

let schedulerTask: ScheduledTask | null = null;

export function startNotificationScheduler() {
  schedulerTask = cron.schedule("* * * * *", async () => {
    console.log("[Scheduler] Running notification check...");

    try {
      await runNotificationScheduler();
    } catch (error) {
      console.error("[Scheduler] Notification check failed:", error);
    }
  });

  console.log("[Scheduler] Notification scheduler started.");
}

export function stopNotificationScheduler() {
  schedulerTask?.stop();
  schedulerTask = null;

  console.log("[Scheduler] Notification scheduler stopped.");
}
