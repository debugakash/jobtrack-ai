import { Router } from "express";

import { authenticate } from "../middleware/auth.middleware.js";
import { uploadResume } from "../middleware/upload.middleware.js";
import { asyncHandler } from "../utils/async-handler.js";

import {
  createResumeController,
  deleteResumeController,
  getResumeByIdController,
  getResumesController,
  updateResumeController,
} from "../controllers/resume.controller.js";

const router = Router();

router.get("/", authenticate, asyncHandler(getResumesController));

router.get("/:id", authenticate, asyncHandler(getResumeByIdController));

router.post(
  "/",
  authenticate,
  uploadResume.single("resume"),
  asyncHandler(createResumeController),
);

router.patch("/:id", authenticate, asyncHandler(updateResumeController));

router.delete("/:id", authenticate, asyncHandler(deleteResumeController));

export default router;
