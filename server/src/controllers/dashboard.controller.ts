import { Request, Response } from "express";
import {
  getDashboardStatsService,
  getMonthlyApplicationsService,
  getPendingFollowUpsService,
  getStatusDistributionService,
  getTopCompaniesService,
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

export async function getMonthlyApplications(req: Request, res: Response) {
  const monthlyApplications = await getMonthlyApplicationsService(
    req.user!.userId,
  );

  res.status(200).json({
    success: true,
    data: monthlyApplications,
  });
}

export async function getTopCompanies(req: Request, res: Response) {
  const companies = await getTopCompaniesService(req.user!.userId);

  res.status(200).json({
    success: true,
    data: companies,
  });
}

export async function getPendingFollowUpsController(
  req: Request,
  res: Response,
) {
  const data = await getPendingFollowUpsService(req.user!.userId);

  return res.json({
    success: true,
    data,
  });
}
