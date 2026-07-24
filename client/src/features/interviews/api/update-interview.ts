import { api } from "@/lib/api";

import type { InterviewFormValues } from "../validators/interview-schema";

export async function updateInterview(
  interviewId: string,
  data: Partial<InterviewFormValues> & { completed?: boolean },
) {
  const response = await api.patch(`/interviews/${interviewId}`, data);

  return response.data.data;
}
