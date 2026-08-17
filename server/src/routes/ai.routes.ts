import { Router } from "express";

import { authenticate } from "../middleware/auth.middleware.js";
import { asyncHandler } from "../utils/async-handler.js";
import { analyzeJobController } from "../controllers/ai.controller.js";

const router = Router();

router.post(
  "/jobs/:jobId/analyze",
  authenticate,
  asyncHandler(analyzeJobController),
);

export default router;
