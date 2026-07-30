import type { JobStatus } from "@/features/jobs/types/job";

export interface DashboardStats {
  totalJobs: number;
  wishlist: number;
  applied: number;
  screening: number;
  interview: number;
  offer: number;
  accepted: number;
  rejected: number;
}

export interface UpcomingInterview {
  id: string;

  round: string;

  scheduledAt: string;

  completed: boolean;

  interviewerName?: string | null;

  meetingLink?: string | null;

  notes?: string | null;

  job: {
    id: string;
    company: string;
    jobTitle: string;
    status: JobStatus;
  };
}
