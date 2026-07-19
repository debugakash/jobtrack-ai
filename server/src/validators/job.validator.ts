import { JobStatus, JobType, WorkMode, JobSource } from "@prisma/client";
import z from "zod";

export const createJobSchema = z.object({
  company: z.string().min(1),
  jobTitle: z.string().min(1),

  location: z.string().optional(),

  jobType: z.enum(JobType),

  workMode: z.enum(WorkMode),

  status: z.enum(JobStatus).optional(),

  salaryMin: z.number().int().optional(),
  salaryMax: z.number().int().optional(),

  source: z.enum(JobSource).optional(),

  jobUrl: z.string().url().optional(),

  notes: z.string().optional(),

  followUpDate: z.coerce.date().optional(),

  followUpDone: z.boolean().optional(),
});

export const updateJobSchema = createJobSchema.partial();

export const getJobsQuerySchema = z.object({
  search: z.string().trim().optional(),

  status: z.enum(JobStatus).optional(),

  jobType: z.enum(JobType).optional(),

  workMode: z.enum(WorkMode).optional(),

  sort: z
    .enum([
      "newest",
      "oldest",
      "company_asc",
      "company_desc",
      "salary_asc",
      "salary_desc",
    ])
    .optional(),

  page: z.coerce.number().int().positive().default(1),

  limit: z.coerce.number().int().positive().max(100).default(10),
});

export type CreateJobInput = z.infer<typeof createJobSchema>;
