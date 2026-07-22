import { api } from "@/lib/api";

import type { Job } from "../types/job";

interface JobsResponse {
  success: boolean;

  data: Job[];
}

export async function getJobs(): Promise<Job[]> {
  const response = await api.get<JobsResponse>("/jobs");

  return response.data.data;
}
