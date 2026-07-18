import express from "express";
import cors from "cors";
import routes from "./routes/index.js";
import { errorHandler } from "./middleware/error.middleware.js";
import dashboardRoutes from "./routes/dashboard.routes.js";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (_req, res) => {
  res.json({
    success: true,
    message: "Welcome to JobTrack AI API 🚀",
    version: "1.0.0",
  });
});

app.use("/api", routes);
app.use("/api/dashboard", dashboardRoutes);

app.use(errorHandler);

export default app;
