import { Request, Response } from "express";
import {
  getDashboardStatsService,
  getStatusDistributionService,
} from "../services/dashboard.service.js";

export async function getDashboardStats(req: Request, res: Response) {
  const stats = await getDashboardStatsService(req.user!.userId);

  res.status(200).json({
    success: true,
    data: stats,
  });
}

export async function getStatusDistribution(req: Request, res: Response) {
  const distribution = await getStatusDistributionService(req.user!.userId);

  const formattedDistribution = distribution.map((item) => ({
    status: item.status,
    count: item._count.status,
  }));

  res.status(200).json({
    success: true,
    data: formattedDistribution,
  });
}
