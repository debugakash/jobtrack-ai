export type JobStatus =
  | "WISHLIST"
  | "APPLIED"
  | "SCREENING"
  | "INTERVIEW"
  | "OFFER"
  | "REJECTED"
  | "ACCEPTED";

export type JobType = "FULL_TIME" | "PART_TIME" | "CONTRACT" | "INTERN";

export type WorkMode = "REMOTE" | "HYBRID" | "ONSITE";

export type JobSource =
  | "LINKEDIN"
  | "NAUKRI"
  | "INDEED"
  | "REFERRAL"
  | "COMPANY_WEBSITE"
  | "OTHER";

export interface CreateJobRequest {
  company: string;
  jobTitle: string;
  description?: string;
  location?: string;
  jobType: JobType;
  workMode: WorkMode;
  salaryMin?: number;
  salaryMax?: number;
  status: JobStatus;
  source?: JobSource;
  jobUrl?: string;
  notes?: string;
}

export interface JobActivity {
  id: string;

  type:
    | "CREATED"
    | "STATUS_CHANGED"
    | "NOTE"
    | "FOLLOW_UP"
    | "INTERVIEW"
    | "RESUME"
    | "OFFER"
    | "REJECTED"
    | "OTHER";

  title: string;

  description?: string | null;

  eventDate: string;
}

export interface Resume {
  id: string;

  originalName: string;

  label?: string | null;

  isDefault: boolean;
}

export interface Job {
  id: string;

  company: string;

  jobTitle: string;

  description?: string | null;

  location?: string;

  jobType: JobType;

  workMode: WorkMode;

  status: JobStatus;

  salaryMin?: number | null;
  salaryMax?: number | null;

  source?: JobSource | null;

  jobUrl?: string | null;

  notes?: string | null;

  followUpDate?: string | null;

  followUpDone: boolean;

  resumeId?: string | null;

  appliedAt?: string | null;

  createdAt: string;

  updatedAt: string;

  activities: JobActivity[];

  interviews: unknown[];

  resume: Resume | null;
}

export interface CreateJobResponse {
  success: boolean;
  data: Job;
}
