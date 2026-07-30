import { api } from "@/lib/api";

import type { UpcomingInterview } from "../types/dashboard";

export async function getUpcomingInterviews(): Promise<UpcomingInterview[]> {
  const response = await api.get("/dashboard/upcoming-interviews");

  return response.data.data;
}
