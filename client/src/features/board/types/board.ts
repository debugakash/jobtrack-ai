import type { Job } from "@/features/jobs/types/job";

export interface BoardColumn {
  id: string;
  title: string;
  jobs: Job[];
}
