import { api } from "@/lib/api";

export async function getJob(id: string) {
  const response = await api.get(`/jobs/${id}`);

  return response.data.data;
}
