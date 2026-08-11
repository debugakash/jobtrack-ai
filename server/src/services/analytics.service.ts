import {
  getAnalyticsOverview,
  getMonthlyApplications,
  getStatusDistribution,
  getSourceDistribution,
  getApplicationFunnel,
  getAverageTimeToInterview,
  getAverageTimeToResponse,
} from "../repositories/analytics.repository.js";

export async function getAnalytics(userId: string, range: number | "all") {
  const [
    overview,
    monthlyApplications,
    statusDistribution,
    sourceDistribution,
    applicationFunnel,
    averageTimeToInterview,
    averageTimeToResponse,
  ] = await Promise.all([
    getAnalyticsOverview(userId, range),
    getMonthlyApplications(userId, range),
    getStatusDistribution(userId, range),
    getSourceDistribution(userId, range),
    getApplicationFunnel(userId, range),
    getAverageTimeToInterview(userId),
    getAverageTimeToResponse(userId, range),
  ]);

  return {
    overview,
    monthlyApplications,
    statusDistribution,
    sourceDistribution,
    applicationFunnel,
    averageTimeToInterview,
    averageTimeToResponse,
  };
}
