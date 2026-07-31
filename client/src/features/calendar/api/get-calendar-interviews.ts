import { api } from "@/lib/api";

import type { Interview } from "@/features/interviews/types/interview";

export async function getCalendarInterviews(): Promise<Interview[]> {
  const response = await api.get("/interviews");

  return response.data.data;
}
