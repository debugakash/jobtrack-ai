import prisma from "../config/prisma.js";
import { JobActivityType } from "@prisma/client";

export function createJobActivity(
  jobId: string,
  type: JobActivityType,
  title: string,
  description?: string,
  eventDate: Date = new Date(),
) {
  return prisma.jobActivity.create({
    data: {
      jobId,
      type,
      title,
      description,
      eventDate,
    },
  });
}

export function getActivitiesByJobId(userId: string, jobId: string) {
  return prisma.jobActivity.findMany({
    where: {
      job: {
        userId,
      },
      jobId,
    },
    orderBy: [
      {
        eventDate: "desc",
      },
      {
        createdAt: "desc",
      },
    ],
  });
}
