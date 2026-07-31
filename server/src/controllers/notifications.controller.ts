import { Request, Response } from "express";

import {
  getNotificationsService,
  markAllNotificationsReadService,
  markNotificationReadService,
} from "../services/notifications.service.js";

export async function getNotificationsController(req: Request, res: Response) {
  const data = await getNotificationsService(req.user!.userId);

  return res.json({
    success: true,
    data,
  });
}

export async function markNotificationReadController(
  req: Request,
  res: Response,
) {
  const notificationId = req.params.id as string;

  await markNotificationReadService(notificationId, req.user!.userId);

  return res.json({
    success: true,
  });
}

export async function markAllNotificationsReadController(
  req: Request,
  res: Response,
) {
  await markAllNotificationsReadService(req.user!.userId);

  return res.json({
    success: true,
  });
}
