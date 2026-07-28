import { api } from "@/lib/api";
import type { DashboardStats } from "../types/dashboard";

interface DashboardStatsResponse {
  success: boolean;
  data: DashboardStats;
}

export async function getDashboardStats() {
  const response = await api.get<DashboardStatsResponse>("/dashboard/stats");

  return response.data.data;
}
