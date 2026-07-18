import { Request, Response } from "express";
import { getDashboardStatsService } from "../services/dashboard.service.js";

export async function getDashboardStats(req: Request, res: Response) {
  const stats = await getDashboardStatsService(req.user!.userId);

  res.status(200).json({
    success: true,
    data: stats,
  });
}
