import { api } from "@/lib/api";

import type { RecentActivity } from "../types/recent-activity";

export async function getRecentActivity(): Promise<RecentActivity[]> {
  const response = await api.get("/dashboard/recent-activity");

  return response.data.data;
}
