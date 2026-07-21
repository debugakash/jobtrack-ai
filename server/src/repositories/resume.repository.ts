import prisma from "../config/prisma.js";
import { Prisma } from "@prisma/client";

export function createResume(data: Prisma.ResumeCreateInput) {
  return prisma.resume.create({
    data,
  });
}

export function getResumes(userId: string) {
  return prisma.resume.findMany({
    where: {
      userId,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
}

export function getResumeById(userId: string, resumeId: string) {
  return prisma.resume.findFirst({
    where: {
      id: resumeId,
      userId,
    },
  });
}

export function updateResume(
  userId: string,
  resumeId: string,
  data: Prisma.ResumeUpdateInput,
) {
  return prisma.resume.updateMany({
    where: {
      id: resumeId,
      userId,
    },
    data,
  });
}

export function deleteResume(userId: string, resumeId: string) {
  return prisma.resume.deleteMany({
    where: {
      id: resumeId,
      userId,
    },
  });
}
