import { z } from "zod";

import {
  JOB_STATUSES,
  JOB_TYPES,
  WORK_MODES,
  JOB_SOURCES,
} from "@/constants/job";

export const jobSchema = z.object({
  company: z.string().min(1, "Company is required"),

  jobTitle: z.string().min(1, "Job title is required"),

  location: z.string().optional(),

  jobType: z.enum(JOB_TYPES),

  workMode: z.enum(WORK_MODES),

  salaryMin: z.number().int().nonnegative().optional(),

  salaryMax: z.number().int().nonnegative().optional(),

  status: z.enum(JOB_STATUSES),

  source: z.enum(JOB_SOURCES).optional(),

  jobUrl: z.string().url("Enter a valid URL").optional().or(z.literal("")),

  notes: z.string().optional(),
});

export type JobFormValues = z.infer<typeof jobSchema>;
