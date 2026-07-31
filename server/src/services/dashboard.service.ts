import {
  getDashboardStats,
  getMonthlyApplications,
  getPendingFollowUps,
  getRecentActivity,
  getStatusDistribution,
  getTopCompanies,
  getUpcomingInterviews,
} from "../repositories/dashboard.repository.js";

export function getDashboardStatsService(userId: string) {
  return getDashboardStats(userId);
}

export function getStatusDistributionService(userId: string) {
  return getStatusDistribution(userId);
}

export async function getMonthlyApplicationsService(userId: string) {
  const jobs = await getMonthlyApplications(userId);

  const now = new Date();

  const months: { month: string; count: number }[] = [];

  for (let i = 5; i >= 0; i--) {
    const date = new Date(now.getFullYear(), now.getMonth() - i, 1);

    months.push({
      month: date.toLocaleString("en-US", {
        month: "short",
        year: "numeric",
      }),
      count: 0,
    });
  }

  for (const job of jobs) {
    const month = job.createdAt.toLocaleString("en-US", {
      month: "short",
      year: "numeric",
    });

    const existing = months.find((m) => m.month === month);

    if (existing) {
      existing.count++;
    }
  }

  return months;
}

export async function getTopCompaniesService(userId: string) {
  const companies = await getTopCompanies(userId);

  return companies.map((company) => ({
    company: company.company,
    count: company._count.company,
  }));
}

export async function getPendingFollowUpsService(userId: string) {
  return getPendingFollowUps(userId);
}

export async function getUpcomingInterviewsService(userId: string) {
  const upcomingInterviews = await getUpcomingInterviews(userId);

  return upcomingInterviews;
}

export function getRecentActivityService(
  userId: string,
  page: number,
  limit: number,
) {
  return getRecentActivity(userId, page, limit);
}
