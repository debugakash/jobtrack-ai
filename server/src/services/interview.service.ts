import prisma from "../config/prisma.js";
import { Prisma } from "@prisma/client";
import {
  createInterviewDto,
  updateInterviewDto,
} from "../dtos/interview.dto.js";
import { NotFoundError } from "../errors/NotFoundError.js";
import {
  createInterview,
  deleteInterview,
  getAllUserInterviews,
  getInterviewById,
  getInterviewsByJobId,
  updateInterview,
} from "../repositories/interview.repository.js";

export async function createInterviewService(
  userId: string,
  jobId: string,
  data: createInterviewDto,
) {
  const job = await prisma.job.findFirst({
    where: {
      id: jobId,
      userId,
    },
  });

  if (!job) {
    throw new NotFoundError("Job not found");
  }

  const result = await prisma.$transaction(async (tx) => {
    const interview = await tx.interview.create({
      data: {
        ...data,
        job: {
          connect: {
            id: jobId,
          },
        },
      },
    });

    const shouldUpdateStatus =
      job.status === "WISHLIST" ||
      job.status === "APPLIED" ||
      job.status === "SCREENING";

    if (shouldUpdateStatus) {
      await tx.job.update({
        where: {
          id: jobId,
        },
        data: {
          status: "INTERVIEW",
        },
      });

      await tx.jobActivity.create({
        data: {
          jobId,
          type: "INTERVIEW",
          title: "Interview scheduled",
          description: `${data.round} interview scheduled.`,
          eventDate: data.scheduledAt,
        },
      });
    }

    return interview;
  });

  return result;
}

export async function getInterviewsService(userId: string, jobId: string) {
  return getInterviewsByJobId(userId, jobId);
}

export async function getAllUserInterviewsService(userId: string) {
  return getAllUserInterviews(userId);
}

export async function getInterviewByIdService(
  userId: string,
  interviewId: string,
) {
  const interview = await getInterviewById(userId, interviewId);

  if (!interview) {
    throw new NotFoundError("Interview not found");
  }

  return interview;
}

export async function updateInterviewService(
  userId: string,
  interviewId: string,
  data: updateInterviewDto,
) {
  const existingInterview = await getInterviewById(userId, interviewId);

  if (!existingInterview) {
    throw new NotFoundError("Interview not found");
  }

  const result = await updateInterview(
    userId,
    interviewId,
    data as Prisma.InterviewUpdateInput,
  );

  if (result.count === 0) {
    throw new NotFoundError("Interview not found");
  }

  if (data.completed === true && existingInterview.completed === false) {
    await prisma.jobActivity.create({
      data: {
        jobId: existingInterview.jobId,
        type: "INTERVIEW",
        title: "Interview completed",
        description: `${existingInterview.round} interview was completed.`,
        eventDate: new Date(),
      },
    });
  }

  return getInterviewById(userId, interviewId);
}

export async function deleteInterviewService(
  userId: string,
  interviewId: string,
) {
  const result = await deleteInterview(userId, interviewId);

  if (result.count === 0) {
    throw new NotFoundError("Interview not found");
  }
}
