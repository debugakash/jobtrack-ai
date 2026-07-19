import { Router } from "express";
import {
  getDashboardStats,
  getMonthlyApplications,
  getPendingFollowUpsController,
  getStatusDistribution,
  getTopCompanies,
} from "../controllers/dashboard.controller.js";
import { authenticate } from "../middleware/auth.middleware.js";

const router = Router();

router.get("/stats", authenticate, getDashboardStats);

router.get("/status-distribution", authenticate, getStatusDistribution);

router.get("/monthly-applications", authenticate, getMonthlyApplications);

router.get("/top-companies", authenticate, getTopCompanies);

router.get("/follow-ups", authenticate, getPendingFollowUpsController);

export default router;
