import { api } from "@/lib/api";

export interface ForgotPasswordRequest {
  email: string;
}

export async function forgotPassword(
  data: ForgotPasswordRequest,
): Promise<void> {
  await api.post("/auth/forgot-password", data);
}
