import prisma from "../config/prisma.js";

export async function getDashboardStats(userId: string) {
  const [
    totalJobs,
    wishlist,
    applied,
    screening,
    interview,
    offer,
    accepted,
    rejected,
  ] = await Promise.all([
    prisma.job.count({
      where: { userId },
    }),
    prisma.job.count({
      where: { userId, status: "WISHLIST" },
    }),
    prisma.job.count({
      where: { userId, status: "APPLIED" },
    }),
    prisma.job.count({
      where: { userId, status: "SCREENING" },
    }),
    prisma.job.count({
      where: { userId, status: "INTERVIEW" },
    }),
    prisma.job.count({
      where: { userId, status: "OFFER" },
    }),
    prisma.job.count({
      where: { userId, status: "ACCEPTED" },
    }),
    prisma.job.count({
      where: { userId, status: "REJECTED" },
    }),
  ]);

  return {
    totalJobs,
    wishlist,
    applied,
    screening,
    interview,
    offer,
    accepted,
    rejected,
  };
}

export async function getStatusDistribution(userId: string) {
  return prisma.job.groupBy({
    by: ["status"],

    where: { userId },

    _count: {
      status: true,
    },

    orderBy: {
      status: "asc",
    },
  });
}
