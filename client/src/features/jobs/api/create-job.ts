import { api } from "@/lib/api";

import type { CreateJobRequest, CreateJobResponse } from "../types/job";

export async function createJob(
  data: CreateJobRequest,
): Promise<CreateJobResponse> {
  const response = await api.post<CreateJobResponse>("/jobs", data);

  return response.data;
}
