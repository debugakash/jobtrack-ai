import prisma from "../config/prisma.js";
import { Prisma } from "@prisma/client";

export function createJob(data: {
  company: string;
  jobTitle: string;
  location?: string;
  jobType: "FULL_TIME" | "PART_TIME" | "CONTRACT" | "INTERN";
  workMode: "REMOTE" | "HYBRID" | "ONSITE";
  salaryMin?: number;
  salaryMax?: number;
  source?:
    | "LINKEDIN"
    | "NAUKRI"
    | "INDEED"
    | "REFERRAL"
    | "COMPANY_WEBSITE"
    | "OTHER";
  jobUrl?: string;
  notes?: string;
  user: {
    connect: {
      id: string;
    };
  };
}) {
  return prisma.job.create({
    data,
  });
}

export function getJobsByUserId(userId: string) {
  return prisma.job.findMany({
    where: {
      userId,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
}

export function getJobById(userId: string, jobId: string) {
  return prisma.job.findFirst({
    where: {
      id: jobId,
      userId,
    },
  });
}

export function updateJob(
  userId: string,
  jobId: string,
  data: Prisma.JobUpdateInput,
) {
  return prisma.job.updateMany({
    where: {
      id: jobId,
      userId,
    },
    data,
  });
}
