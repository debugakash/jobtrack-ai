import { api } from "@/lib/api";

export async function updateResume(
  id: string,
  data: {
    label?: string;
    isDefault?: boolean;
  },
) {
  const response = await api.patch(`/resumes/${id}`, data);

  return response.data.data;
}
