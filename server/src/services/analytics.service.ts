import {
  getAnalyticsOverview,
  getMonthlyApplications,
  getStatusDistribution,
  getSourceDistribution,
} from "../repositories/analytics.repository.js";

export async function getAnalytics(userId: string, range: number | "all") {
  const [
    overview,
    monthlyApplications,
    statusDistribution,
    sourceDistribution,
  ] = await Promise.all([
    getAnalyticsOverview(userId, range),
    getMonthlyApplications(userId, range),
    getStatusDistribution(userId, range),
    getSourceDistribution(userId, range),
  ]);

  return {
    overview,
    monthlyApplications,
    statusDistribution,
    sourceDistribution,
  };
}
