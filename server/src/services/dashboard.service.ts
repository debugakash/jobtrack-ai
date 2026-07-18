import { getDashboardStats } from "../repositories/dashboard.repository.js";

export function getDashboardStatsService(userId: string) {
  return getDashboardStats(userId);
}
