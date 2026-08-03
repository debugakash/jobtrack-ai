import { api } from "@/lib/api";

export async function updateAvatar(file: File) {
  const formData = new FormData();

  formData.append("avatar", file);

  const response = await api.patch("/auth/me/avatar", formData);

  return response.data.data;
}
