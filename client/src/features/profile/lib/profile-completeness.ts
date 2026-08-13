import type { User } from "@/features/auth/types/auth";

export interface ProfileCompletenessData {
  profile: User | null;
  hasDefaultResume: boolean;
}

const COMPLETENESS_FIELDS = [
  "avatar",
  "firstName",
  "lastName",
  "phone",
  "location",
  "headline",
  "bio",
  "linkedinUrl",
  "githubUrl",
  "portfolioUrl",
  "skills",
] as const;

function hasValue(value: unknown): boolean {
  if (typeof value !== "string") {
    return Boolean(value);
  }

  return value.trim().length > 0;
}

export function getProfileCompleteness({
  profile,
  hasDefaultResume,
}: ProfileCompletenessData): number {
  if (!profile) {
    return 0;
  }

  const completedFields = COMPLETENESS_FIELDS.filter((field) =>
    hasValue(profile[field]),
  ).length;

  const resumeScore = hasDefaultResume ? 1 : 0;

  const totalFields = COMPLETENESS_FIELDS.length + 1;
  const totalCompleted = completedFields + resumeScore;

  return Math.round((totalCompleted / totalFields) * 100);
}
