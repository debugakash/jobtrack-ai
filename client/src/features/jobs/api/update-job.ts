import { api } from "@/lib/api";

import type { JobFormValues } from "../validators/job-schema";

export async function updateJob(id: string, data: JobFormValues) {
  const response = await api.patch(`/jobs/${id}`, data);

  return response.data;
}
