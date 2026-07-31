import { Request, Response } from "express";
import {
  getDashboardStatsService,
  getMonthlyApplicationsService,
  getPendingFollowUpsService,
  getRecentActivityService,
  getStatusDistributionService,
  getTopCompaniesService,
  getUpcomingInterviewsService,
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

export async function getUpcomingInterviewsController(
  req: Request,
  res: Response,
) {
  const upcomingInterviews = await getUpcomingInterviewsService(
    req.user!.userId,
  );

  return res.json({
    success: true,
    data: upcomingInterviews,
  });
}

export async function getRecentActivityController(req: Request, res: Response) {
  const page = Number(req.query.page ?? 1);

  const limit = Number(req.query.limit ?? 20);

  const data = await getRecentActivityService(req.user!.userId, page, limit);

  return res.json({
    success: true,
    data,
  });
}
