import { api } from "@/lib/api";

export interface ChangePasswordData {
  currentPassword: string;
  newPassword: string;
}

export async function changePassword(data: ChangePasswordData) {
  const response = await api.patch("/auth/me/password", data);

  return response.data;
}
