import { Router } from "express";

import { asyncHandler } from "../utils/async-handler.js";
import { authenticate } from "../middleware/auth.middleware.js";

import {
  createInterviewController,
  deleteInterviewController,
  getInterviewByIdController,
  getInterviewsController,
  updateInterviewController,
} from "../controllers/interview.controller.js";

const router = Router();

router.use(authenticate);

router.post("/jobs/:jobId/interviews", asyncHandler(createInterviewController));

router.get("/jobs/:jobId/interviews", asyncHandler(getInterviewsController));

router.get(
  "/interviews/:interviewId",
  asyncHandler(getInterviewByIdController),
);

router.patch(
  "/interviews/:interviewId",
  asyncHandler(updateInterviewController),
);

router.delete(
  "/interviews/:interviewId",
  asyncHandler(deleteInterviewController),
);

export default router;
