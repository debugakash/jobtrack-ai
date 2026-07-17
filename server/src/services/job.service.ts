import { CreateJobInput } from "../validators/job.validator.js";
import {
  createJob,
  deleteJob,
  getJobById,
  getJobsByUserId,
  updateJob,
} from "../repositories/job.repository.js";
import { NotFoundError } from "../errors/index.js";
import {
  CreateJobDto,
  GetJobsQueryDto,
  UpdateJobDto,
} from "../dtos/job.dto.js";

export async function createJobService(userId: string, data: CreateJobDto) {
  return createJob({
    ...data,
    user: {
      connect: {
        id: userId,
      },
    },
  });
}

export async function getJobsService(userId: string, query: GetJobsQueryDto) {
  return getJobsByUserId(userId, query);
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
  data: UpdateJobDto,
) {
  const result = await updateJob(userId, jobId, data);

  if (result.count === 0) {
    throw new NotFoundError("Job not found");
  }

  const updatedJob = await getJobById(userId, jobId);

  return updatedJob;
}

export async function deleteJobService(userId: string, jobId: string) {
  const result = await deleteJob(userId, jobId);

  if (result.count === 0) {
    throw new NotFoundError("Job not found");
  }
}
