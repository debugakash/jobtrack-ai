import prisma from "../config/prisma.js";

import type { Prisma } from "@prisma/client";

export function createJobAiAnalysis(data: Prisma.JobAiAnalysisCreateInput) {
  return prisma.jobAiAnalysis.create({
    data,
  });
}

export function getJobAiAnalysis(jobId: string) {
  return prisma.jobAiAnalysis.findUnique({
    where: {
      jobId,
    },
  });
}

export function updateJobAiAnalysis(
  jobId: string,
  data: Prisma.JobAiAnalysisUpdateInput,
) {
  return prisma.jobAiAnalysis.update({
    where: {
      jobId,
    },
    data,
  });
}
