import { api } from "@/lib/api";

export interface FollowUp {
  id: string;
  company: string;
  jobTitle: string;
  status: string;
  followUpDate: string;
}

interface FollowUpsResponse {
  success: boolean;
  data: FollowUp[];
}

export async function getFollowUps() {
  const response = await api.get<FollowUpsResponse>("/dashboard/follow-ups");

  return response.data.data;
}
