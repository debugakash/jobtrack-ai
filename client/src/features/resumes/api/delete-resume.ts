import { api } from "@/lib/api";

export async function deleteResume(id: string) {
  await api.delete(`/resumes/${id}`);
}
