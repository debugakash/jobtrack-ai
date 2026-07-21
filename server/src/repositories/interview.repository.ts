import prisma from "../config/prisma.js";
import { Prisma } from "@prisma/client";

export function createInterview(data: Prisma.InterviewCreateInput) {
  return prisma.interview.create({
    data,
  });
}

export function getInterviewsByJobId(userId: string, jobId: string) {
  return prisma.interview.findMany({
    where: {
      jobId,
      job: {
        userId,
      },
    },

    orderBy: {
      scheduledAt: "asc",
    },
  });
}

export function getInterviewById(userId: string, interviewId: string) {
  return prisma.interview.findFirst({
    where: {
      id: interviewId,
      job: {
        userId,
      },
    },
  });
}

export function updateInterview(
  userId: string,
  interviewId: string,
  data: Prisma.InterviewUpdateInput,
) {
  return prisma.interview.updateMany({
    where: {
      id: interviewId,
      job: {
        userId,
      },
    },
    data,
  });
}

export function deleteInterview(userId: string, interviewId: string) {
  return prisma.interview.deleteMany({
    where: {
      id: interviewId,
      job: {
        userId,
      },
    },
  });
}
