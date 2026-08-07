import app from "./app.js";
import { env } from "./config/env.js";
import { startNotificationScheduler } from "./schedulers/notification.scheduler.js";

app.listen(Number(env.PORT), () => {
  console.log(`🚀 Server running on http://localhost:${env.PORT}`);

  startNotificationScheduler();
});
