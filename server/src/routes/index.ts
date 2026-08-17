import { Router } from "express";
import authRoutes from "./auth.routes.js";
import jobRoutes from "./job.routes.js";
import jobActivityRoutes from "./job-activity.routes.js";
import interviewRoutes from "./interview.routes.js";
import resumeRoutes from "./resume.routes.js";
import userRoutes from "./user.routes.js";
import aiRoutes from "./ai.routes.js";

const router = Router();

router.use("/auth", authRoutes);
router.use("/users", userRoutes);
router.use("/jobs", jobRoutes);
router.use("/jobs", jobActivityRoutes);
router.use("/", interviewRoutes);
router.use("/resumes", resumeRoutes);
router.use("/ai", aiRoutes);

export default router;
