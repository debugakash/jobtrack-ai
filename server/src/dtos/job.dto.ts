import { z } from "zod";
import {
  createJobSchema,
  getJobsQuerySchema,
  updateJobSchema,
} from "../validators/job.validator.js";
import { Job } from "@prisma/client";

export type CreateJobDto = z.infer<typeof createJobSchema>;

export type UpdateJobDto = z.infer<typeof updateJobSchema>;

export type GetJobsQueryDto = z.output<typeof getJobsQuerySchema>;

export interface GetJobsResultDto {
  jobs: Job[];
  total: number;
}
