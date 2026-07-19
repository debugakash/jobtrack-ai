import {
  getDashboardStats,
  getMonthlyApplications,
  getPendingFollowUps,
  getStatusDistribution,
  getTopCompanies,
} from "../repositories/dashboard.repository.js";

export function getDashboardStatsService(userId: string) {
  return getDashboardStats(userId);
}

export function getStatusDistributionService(userId: string) {
  return getStatusDistribution(userId);
}

export async function getMonthlyApplicationsService(userId: string) {
  const jobs = await getMonthlyApplications(userId);

  const monthlyCounts = new Map<string, number>();

  for (const job of jobs) {
    const month = job.createdAt.toLocaleString("en-US", {
      month: "short",
      year: "numeric",
    });

    monthlyCounts.set(month, (monthlyCounts.get(month) ?? 0) + 1);
  }

  return Array.from(monthlyCounts.entries()).map(([month, count]) => ({
    month,
    count,
  }));
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
