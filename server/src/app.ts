import express from "express";
import cors from "cors";
import helmet from "helmet";
import routes from "./routes/index.js";
import { errorHandler } from "./middleware/error.middleware.js";
import dashboardRoutes from "./routes/dashboard.routes.js";
import analyticsRoutes from "./routes/analytics.routes.js";
import notificationsRoutes from "./routes/notifications.routes.js";
import { env } from "./config/env.js";

const app = express();

app.use(helmet());

const allowedOrigins = [
  env.CLIENT_URL,
  ...(env.NODE_ENV === "development" ? ["http://localhost:4173"] : []),
];

app.use(
  cors({
    origin: allowedOrigins,
  }),
);
app.use(express.json({ limit: "1mb" }));

app.get("/", (_req, res) => {
  res.json({
    success: true,
    message: "Welcome to JobTrack AI API 🚀",
    version: "1.0.0",
  });
});

app.use("/api", routes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/notifications", notificationsRoutes);

app.use(errorHandler);

export default app;
