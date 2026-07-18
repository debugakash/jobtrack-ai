import { Router } from "express";

import { authenticate } from "../middleware/auth.middleware.js";
import { asyncHandler } from "../utils/async-handler.js";
import { getJobActivitiesController } from "../controllers/job-activity.controller.js";

const router = Router();

/**
 * GET /api/jobs/:jobId/activities
 */
router.get(
  "/:jobId/activities",
  authenticate,
  asyncHandler(getJobActivitiesController),
);

export default router;
