import { api } from "@/lib/api";

export async function deleteJob(id: string) {
  const response = await api.delete(`/jobs/${id}`);

  return response.data;
}
