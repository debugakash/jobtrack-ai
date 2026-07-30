import { Router } from "express";

import { authenticate } from "../middleware/auth.middleware.js";
import { asyncHandler } from "../utils/async-handler.js";

import { getAnalyticsController } from "../controllers/analytics.controller.js";

const router = Router();

router.get("/", authenticate, asyncHandler(getAnalyticsController));

export default router;
