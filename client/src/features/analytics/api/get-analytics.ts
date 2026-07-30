import { api } from "@/lib/api";

import type { AnalyticsResponse } from "../types/analytics";

export async function getAnalytics(range: string): Promise<AnalyticsResponse> {
  const response = await api.get("/analytics", {
    params: {
      range,
    },
  });

  return response.data.data;
}
