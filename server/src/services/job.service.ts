import { CreateJobInput } from "../validators/job.validator.js";
import {
  createJob,
  getJobById,
  getJobsByUserId,
  updateJob,
} from "../repositories/job.repository.js";
import { NotFoundError } from "../errors/index.js";
import { Prisma } from "@prisma/client";

export async function createJobService(userId: string, data: CreateJobInput) {
  return createJob({
    ...data,
    user: {
      connect: {
        id: userId,
      },
    },
  });
}

export async function getJobsService(userId: string) {
  return getJobsByUserId(userId);
}

export async function getJobByIdService(userId: string, jobId: string) {
  const job = await getJobById(userId, jobId);

  if (!job) {
    throw new NotFoundError("Job not found");
  }

  return job;
}

export async function updateJobService(
  userId: string,
  jobId: string,
  data: Prisma.JobUpdateInput,
) {
  const result = await updateJob(userId, jobId, data);

  if (result.count === 0) {
    throw new NotFoundError("Job not found");
  }

  const updatedJob = await getJobById(userId, jobId);

  return updatedJob;
}
