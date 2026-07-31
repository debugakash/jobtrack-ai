import { Router } from "express";

import { authenticate } from "../middleware/auth.middleware.js";

import {
  getNotificationsController,
  markAllNotificationsReadController,
  markNotificationReadController,
} from "../controllers/notifications.controller.js";

const router = Router();

router.get("/", authenticate, getNotificationsController);

router.patch("/:id/read", authenticate, markNotificationReadController);

router.patch("/read-all", authenticate, markAllNotificationsReadController);

export default router;
