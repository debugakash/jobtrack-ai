import { api } from "@/lib/api";

export async function attachResume(jobId: string, resumeId: string | null) {
  const response = await api.patch(`/jobs/${jobId}`, {
    resumeId,
  });

  return response.data.data;
}
