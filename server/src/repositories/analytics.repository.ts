import prisma from "../config/prisma.js";
import { format, subMonths, startOfMonth, subDays } from "date-fns";

function getDateFilter(range: number | "all") {
  if (range === "all") {
    return {};
  }

  return {
    gte: subDays(new Date(), range),
  };
}

export async function getAnalyticsOverview(
  userId: string,
  range: number | "all",
) {
  const createdAtFilter = getDateFilter(range);
  const [totalApplications, offers, interviews, rejections] = await Promise.all(
    [
      prisma.job.count({
        where: {
          userId,
          createdAt: createdAtFilter,
        },
      }),

      prisma.job.count({
        where: {
          userId,
          status: "OFFER",
        },
      }),

      prisma.job.count({
        where: {
          userId,
          status: "INTERVIEW",
        },
      }),

      prisma.job.count({
        where: {
          userId,
          status: "REJECTED",
        },
      }),
    ],
  );

  const responseRate =
    totalApplications === 0
      ? 0
      : Math.round(
          ((interviews + offers + rejections) / totalApplications) * 100,
        );

  return {
    totalApplications,
    offers,
    interviews,
    rejections,
    responseRate,
  };
}

export async function getMonthlyApplications(
  userId: string,
  range: number | "all",
) {
  const createdAtFilter = getDateFilter(range);
  const jobs = await prisma.job.findMany({
    where: {
      userId,
      createdAt: createdAtFilter,
    },
    select: {
      appliedAt: true,
      createdAt: true,
    },
    orderBy: {
      createdAt: "asc",
    },
  });

  const monthlyCounts = new Map<string, number>();

  jobs.forEach((job) => {
    const date = job.appliedAt ?? job.createdAt;

    const month = format(date, "MMM");

    monthlyCounts.set(month, (monthlyCounts.get(month) ?? 0) + 1);
  });

  const last12Months = Array.from({ length: 12 }, (_, index) => {
    const date = subMonths(startOfMonth(new Date()), 11 - index);

    const month = format(date, "MMM");

    return {
      month,
      count: monthlyCounts.get(month) ?? 0,
    };
  });

  return last12Months;
}

export async function getStatusDistribution(
  userId: string,
  range: number | "all",
) {
  const createdAtFilter = getDateFilter(range);
  const result = await prisma.job.groupBy({
    by: ["status"],

    where: {
      userId,
      createdAt: createdAtFilter,
    },

    _count: {
      status: true,
    },
  });

  return result.map((item) => ({
    status: item.status,
    count: item._count.status,
  }));
}

export async function getSourceDistribution(
  userId: string,
  range: number | "all",
) {
  const createdAtFilter = getDateFilter(range);
  const result = await prisma.job.groupBy({
    by: ["source"],

    where: {
      userId,
      createdAt: createdAtFilter,
      source: {
        not: null,
      },
    },

    _count: {
      source: true,
    },
  });

  return result.map((item) => ({
    source: item.source,
    count: item._count.source,
  }));
}
