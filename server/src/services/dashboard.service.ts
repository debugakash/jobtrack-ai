import {
  getDashboardStats,
  getStatusDistribution,
} from "../repositories/dashboard.repository.js";

export function getDashboardStatsService(userId: string) {
  return getDashboardStats(userId);
}

export function getStatusDistributionService(userId: string) {
  return getStatusDistribution(userId);
}
