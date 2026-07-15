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
});

export const updateJobSchema = createJobSchema.partial();

export type CreateJobInput = z.infer<typeof createJobSchema>;
