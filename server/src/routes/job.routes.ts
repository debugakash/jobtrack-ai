import { Router } from "express";
import { authenticate } from "../middleware/auth.middleware.js";
import { asyncHandler } from "../utils/async-handler.js";
import {
  createJob,
  deleteJob,
  getJobById,
  getJobs,
  updateJob,
} from "../controllers/job.controller.js";

const router = Router();

router.get("/", authenticate, asyncHandler(getJobs));
router.get("/:id", authenticate, asyncHandler(getJobById));
router.post("/", authenticate, asyncHandler(createJob));
router.patch("/:id", authenticate, asyncHandler(updateJob));
router.delete("/:id", authenticate, asyncHandler(deleteJob));

export default router;
