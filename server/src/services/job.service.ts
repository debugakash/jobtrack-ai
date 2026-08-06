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
import { Prisma, JobActivityType } from "@prisma/client";
import {
  addJobActivity,
  handleStatusChangeActivity,
} from "./job-activity.service.js";
import { getResumeById } from "../repositories/resume.repository.js";

export async function createJobService(userId: string, data: CreateJobDto) {
  const effectiveStatus = data.status ?? "APPLIED";

  const job = await createJob({
    ...data,
    appliedAt: effectiveStatus === "WISHLIST" ? null : new Date(),
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

  const resumeChanged =
    data.resumeId !== undefined && data.resumeId !== existingJob.resumeId;

  let newResume = null;

  // If attaching a resume, make sure it belongs to the current user.
  if (resumeChanged && data.resumeId) {
    newResume = await getResumeById(userId, data.resumeId);

    if (!newResume) {
      throw new NotFoundError("Resume not found");
    }
  }

  const updateData: Prisma.JobUpdateInput = {
    ...data,
  };

  // Set appliedAt when the job becomes an applied/advanced-stage job
  // and it doesn't already have an application date.
  if (
    data.status !== undefined &&
    data.status !== "WISHLIST" &&
    !existingJob.appliedAt
  ) {
    updateData.appliedAt = new Date();
  }

  const result = await updateJob(userId, jobId, updateData);

  if (result.count === 0) {
    throw new NotFoundError("Job not found");
  }

  const updatedJob = await getJobById(userId, jobId);

  if (statusChanged) {
    await handleStatusChangeActivity(jobId, existingJob.status, data.status!);
  }

  if (resumeChanged) {
    const oldResumeName =
      existingJob.resume?.label || existingJob.resume?.originalName;

    const newResumeName = newResume?.label || newResume?.originalName;

    if (!existingJob.resume && newResume) {
      await addJobActivity(
        jobId,
        JobActivityType.RESUME,
        "Resume attached",
        `"${newResumeName}" was attached to this job.`,
      );
    } else if (existingJob.resume && !newResume) {
      await addJobActivity(
        jobId,
        JobActivityType.RESUME,
        "Resume removed",
        `"${oldResumeName}" was removed from this job.`,
      );
    } else if (existingJob.resume && newResume) {
      await addJobActivity(
        jobId,
        JobActivityType.RESUME,
        "Resume changed",
        `Resume changed from "${oldResumeName}" to "${newResumeName}".`,
      );
    }
  }

  return updatedJob;
}

export async function deleteJobService(userId: string, jobId: string) {
  const result = await deleteJob(userId, jobId);

  if (result.count === 0) {
    throw new NotFoundError("Job not found");
  }
}
