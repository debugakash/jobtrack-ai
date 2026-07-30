import { api } from "@/lib/api";
import type { Job } from "@/features/jobs/types/job";

export interface FollowUp {
  id: string;
  company: string;
  jobTitle: string;
  status: Job["status"];
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
