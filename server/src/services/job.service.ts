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
import { JobActivityType } from "@prisma/client";
import { addJobActivity } from "./job-activity.service.js";

export async function createJobService(userId: string, data: CreateJobDto) {
  const job = await createJob({
    ...data,
    user: {
      connect: {
        id: userId,
      },
    },
  });

  await addJobActivity(
    job.id,
    JobActivityType.CREATED,
    `Added ${job.company}`,
    `Job "${job.jobTitle}" was added to the tracker.`,
  );

  return job;
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
  const existingJob = await getJobById(userId, jobId);

  if (!existingJob) {
    throw new NotFoundError("Job not found");
  }

  const statusChanged =
    data.status !== undefined && data.status !== existingJob.status;

  const result = await updateJob(userId, jobId, data);

  if (result.count === 0) {
    throw new NotFoundError("Job not found");
  }

  const updatedJob = await getJobById(userId, jobId);

  if (statusChanged) {
    await addJobActivity(
      jobId,
      "STATUS_CHANGED",
      `Status changed to ${data.status}`,
      `Status changed from ${existingJob.status} to ${data.status}`,
    );
  }

  if (data.status === "INTERVIEW") {
    await addJobActivity(
      jobId,
      "INTERVIEW",
      "Interview Scheduled",
      "Interview stage reached.",
    );
  }

  if (data.status === "OFFER") {
    await addJobActivity(
      jobId,
      "OFFER",
      "Offer Received",
      "Congratulations! An offer has been received.",
    );
  }

  if (data.status === "REJECTED") {
    await addJobActivity(
      jobId,
      "REJECTED",
      "Application Rejected",
      "Application moved to the rejected stage.",
    );
  }

  return updatedJob;
}

export async function deleteJobService(userId: string, jobId: string) {
  const result = await deleteJob(userId, jobId);

  if (result.count === 0) {
    throw new NotFoundError("Job not found");
  }
}
