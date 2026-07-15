import { Router } from "express";
import { authenticate } from "../middleware/auth.middleware.js";
import { asyncHandler } from "../utils/async-handler.js";
import {
  createJob,
  getJobById,
  getJobs,
} from "../controllers/job.controller.js";

const router = Router();

router.get("/", authenticate, asyncHandler(getJobs));
router.get("/:id", authenticate, asyncHandler(getJobById));
router.post("/", authenticate, asyncHandler(createJob));

export default router;
