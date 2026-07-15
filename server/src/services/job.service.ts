import { CreateJobInput } from "../validators/job.validator.js";
import {
  createJob,
  getJobById,
  getJobsByUserId,
} from "../repositories/job.repository.js";
import { NotFoundError } from "../errors/index.js";

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
