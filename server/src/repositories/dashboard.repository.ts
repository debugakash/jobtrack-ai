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

export async function getMonthlyApplications(userId: string) {
  return prisma.job.findMany({
    where: { userId },
    select: {
      createdAt: true,
    },
    orderBy: {
      createdAt: "asc",
    },
  });
}

export function getTopCompanies(userId: string) {
  return prisma.job.groupBy({
    by: ["company"],

    where: { userId },

    _count: {
      company: true,
    },

    orderBy: {
      _count: {
        company: "desc",
      },
    },

    take: 5,
  });
}

export function getPendingFollowUps(userId: string) {
  return prisma.job.findMany({
    where: {
      userId,
      followUpDone: false,
      followUpDate: {
        not: null,
      },
    },

    orderBy: {
      followUpDate: "asc",
    },

    select: {
      id: true,
      company: true,
      jobTitle: true,
      status: true,
      followUpDate: true,
    },
  });
}
