import { api } from "@/lib/api";

import type { Interview } from "../types/interview";

export async function getInterviews(jobId: string): Promise<Interview[]> {
  const response = await api.get(`/jobs/${jobId}/interviews`);

  return response.data.data;
}
