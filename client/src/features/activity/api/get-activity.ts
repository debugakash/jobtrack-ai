import { api } from "@/lib/api";

import type { Activity } from "../types/activity";

export async function getActivity(page = 1, limit = 20): Promise<Activity[]> {
  const response = await api.get("/dashboard/recent-activity", {
    params: {
      page,
      limit,
    },
  });

  return response.data.data;
}
