import { Router } from "express";
import authRoutes from "./auth.routes.js";
import jobRoutes from "./job.routes.js";
import jobActivityRoutes from "./job-activity.routes.js";

const router = Router();

router.use("/auth", authRoutes);
router.use("/jobs", jobRoutes);
router.use("/jobs", jobActivityRoutes);

export default router;
