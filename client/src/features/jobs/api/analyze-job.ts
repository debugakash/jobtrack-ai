import { api } from "@/lib/api";

import type { JobAnalysisResult } from "../types/job";

export async function analyzeJob(id: string): Promise<JobAnalysisResult> {
  const response = await api.post(`/ai/jobs/${id}/analyze`);

  return response.data.data;
}
