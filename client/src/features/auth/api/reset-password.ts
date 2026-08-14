import { api } from "@/lib/api";

export interface ResetPasswordRequest {
  token: string;
  newPassword: string;
}

export async function resetPassword(data: ResetPasswordRequest): Promise<void> {
  await api.post("/auth/reset-password", data);
}
