export interface CreateJobRequest {
  company: string;
  jobTitle: string;
  location?: string;
  jobType: "FULL_TIME" | "PART_TIME" | "CONTRACT" | "INTERN";
  workMode: "REMOTE" | "HYBRID" | "ONSITE";
  status:
    | "WISHLIST"
    | "APPLIED"
    | "SCREENING"
    | "INTERVIEW"
    | "OFFER"
    | "REJECTED"
    | "ACCEPTED";
  jobUrl?: string;
  notes?: string;
}

export interface JobActivity {
  id: string;
  type: string;
  title: string;
  description: string;
  eventDate: string;
}

export interface Job {
  id: string;

  company: string;

  jobTitle: string;

  location?: string;

  jobType: "FULL_TIME" | "PART_TIME" | "CONTRACT" | "INTERN";

  workMode: "REMOTE" | "HYBRID" | "ONSITE";

  status:
    | "WISHLIST"
    | "APPLIED"
    | "SCREENING"
    | "INTERVIEW"
    | "OFFER"
    | "REJECTED"
    | "ACCEPTED";

  salaryMin?: number | null;
  salaryMax?: number | null;

  source?:
    | "LINKEDIN"
    | "NAUKRI"
    | "INDEED"
    | "REFERRAL"
    | "COMPANY_WEBSITE"
    | "OTHER"
    | null;

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

  resume: unknown | null;
}

export interface CreateJobResponse {
  success: boolean;
  data: Job;
}
