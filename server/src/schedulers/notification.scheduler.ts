import cron from "node-cron";

import { runNotificationScheduler } from "../services/notification-scheduler.service.js";

export function startNotificationScheduler() {
  cron.schedule("* * * * *", async () => {
    console.log("[Scheduler] Running notification check...");

    try {
      await runNotificationScheduler();
    } catch (error) {
      console.error("[Scheduler] Notification check failed:", error);
    }
  });

  console.log("[Scheduler] Notification scheduler started.");
}
