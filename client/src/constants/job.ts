export const JOB_TYPES = [
  "FULL_TIME",
  "PART_TIME",
  "CONTRACT",
  "INTERN",
] as const;

export const WORK_MODES = ["REMOTE", "HYBRID", "ONSITE"] as const;

export const JOB_STATUSES = [
  "WISHLIST",
  "APPLIED",
  "SCREENING",
  "INTERVIEW",
  "OFFER",
  "REJECTED",
  "ACCEPTED",
] as const;

export const JOB_SOURCES = [
  "LINKEDIN",
  "NAUKRI",
  "INDEED",
  "REFERRAL",
  "COMPANY_WEBSITE",
  "OTHER",
] as const;
