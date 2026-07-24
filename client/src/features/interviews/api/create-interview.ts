import { api } from "@/lib/api";

import type { InterviewFormValues } from "../validators/interview-schema";

export async function createInterview(
  jobId: string,
  data: InterviewFormValues,
) {
  const response = await api.post(`/jobs/${jobId}/interviews`, data);

  return response.data.data;
}
