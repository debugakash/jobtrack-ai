import { Router } from "express";
import {
  getDashboardStats,
  getStatusDistribution,
} from "../controllers/dashboard.controller.js";
import { authenticate } from "../middleware/auth.middleware.js";

const router = Router();

router.get("/stats", authenticate, getDashboardStats);

router.get("/status-distribution", authenticate, getStatusDistribution);

export default router;
