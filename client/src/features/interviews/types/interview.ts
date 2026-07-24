export interface Interview {
  id: string;

  round: string;

  scheduledAt: string;

  interviewerName?: string | null;

  meetingLink?: string | null;

  notes?: string | null;

  completed: boolean;

  createdAt: string;

  updatedAt: string;

  jobId: string;
}
