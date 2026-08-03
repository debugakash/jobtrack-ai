import { api } from "@/lib/api";

export interface UpdateProfileData {
  firstName: string;
  lastName: string;
}

export async function updateProfile(data: UpdateProfileData) {
  const response = await api.patch("/users/me", data);

  return response.data.data;
}
