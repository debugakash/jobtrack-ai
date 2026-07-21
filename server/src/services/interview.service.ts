import { Prisma } from "@prisma/client";
import {
  createInterviewDto,
  updateInterviewDto,
} from "../dtos/interview.dto.js";
import { NotFoundError } from "../errors/NotFoundError.js";
import {
  createInterview,
  deleteInterview,
  getInterviewById,
  getInterviewsByJobId,
  updateInterview,
} from "../repositories/interview.repository.js";

export async function createInterviewService(
  userId: string,
  jobId: string,
  data: createInterviewDto,
) {
  return createInterview({
    ...data,

    job: {
      connect: {
        id: jobId,
      },
    },
  });
}

export async function getInterviewsService(userId: string, jobId: string) {
  return getInterviewsByJobId(userId, jobId);
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
  const result = await updateInterview(
    userId,
    interviewId,
    data as Prisma.InterviewUpdateInput,
  );

  if (result.count === 0) {
    throw new NotFoundError("Interview not found");
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
