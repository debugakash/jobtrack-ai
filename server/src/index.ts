import app from "./app.js";
import { env } from "./config/env.js";
import prisma from "./config/prisma.js";
import {
  startNotificationScheduler,
  stopNotificationScheduler,
} from "./schedulers/notification.scheduler.js";

const server = app.listen(Number(env.PORT), () => {
  console.log(`Server running on port ${env.PORT}`);

  startNotificationScheduler();
});

async function shutdown(signal: string) {
  console.log(`[Server] ${signal} received. Shutting down...`);

  stopNotificationScheduler();

  server.close(async () => {
    try {
      await prisma.$disconnect();

      console.log("[Server] Shutdown complete.");
      process.exit(0);
    } catch (error) {
      console.error("[Server] Shutdown failed:", error);
      process.exit(1);
    }
  });
}

process.on("SIGTERM", () => {
  void shutdown("SIGTERM");
});

process.on("SIGINT", () => {
  void shutdown("SIGINT");
});
