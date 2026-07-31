import { api } from "@/lib/api";

export async function updateJobStatus(jobId: string, status: string) {
  const response = await api.patch(`/jobs/${jobId}`, {
    status,
  });

  return response.data.data;
}
