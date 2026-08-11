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
          createdAt: createdAtFilter,
        },
      }),

      prisma.job.count({
        where: {
          userId,
          status: "INTERVIEW",
          createdAt: createdAtFilter,
        },
      }),

      prisma.job.count({
        where: {
          userId,
          status: "REJECTED",
          createdAt: createdAtFilter,
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

  const interviewRate =
    totalApplications === 0
      ? 0
      : Math.round((interviews / totalApplications) * 100);

  const offerRate =
    totalApplications === 0
      ? 0
      : Math.round((offers / totalApplications) * 100);

  const rejectionRate =
    totalApplications === 0
      ? 0
      : Math.round((rejections / totalApplications) * 100);

  return {
    totalApplications,
    offers,
    interviews,
    rejections,
    responseRate,
    interviewRate,
    offerRate,
    rejectionRate,
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

    const monthKey = format(date, "yyyy-MM");

    monthlyCounts.set(monthKey, (monthlyCounts.get(monthKey) ?? 0) + 1);
  });

  const last12Months = Array.from({ length: 12 }, (_, index) => {
    const date = subMonths(startOfMonth(new Date()), 11 - index);

    const monthKey = format(date, "yyyy-MM");
    const monthLabel = format(date, "MMM yyyy");

    return {
      month: monthLabel,
      count: monthlyCounts.get(monthKey) ?? 0,
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

export async function getApplicationFunnel(
  userId: string,
  range: number | "all",
) {
  const createdAtFilter = getDateFilter(range);

  const statuses = ["APPLIED", "SCREENING", "INTERVIEW", "OFFER"] as const;

  const result = await Promise.all(
    statuses.map(async (status) => {
      const count = await prisma.job.count({
        where: {
          userId,
          createdAt: createdAtFilter,
          status,
        },
      });

      return {
        status,
        count,
      };
    }),
  );

  return result;
}

export async function getAverageTimeToInterview(userId: string) {
  const interviews = await prisma.interview.findMany({
    where: {
      job: {
        userId,
      },
    },
    select: {
      scheduledAt: true,
      job: {
        select: {
          appliedAt: true,
          createdAt: true,
        },
      },
    },
  });

  const durations = interviews
    .map((interview) => {
      const applicationDate =
        interview.job.appliedAt ?? interview.job.createdAt;

      const interviewDate = interview.scheduledAt;

      const diffMs = interviewDate.getTime() - applicationDate.getTime();

      return diffMs / (1000 * 60 * 60 * 24);
    })
    .filter((days) => days >= 0);

  if (durations.length === 0) {
    return 0;
  }

  const average =
    durations.reduce((sum, days) => sum + days, 0) / durations.length;

  return Math.round(average * 10) / 10;
}

export async function getAverageTimeToResponse(
  userId: string,
  range: number | "all",
) {
  const createdAtFilter = getDateFilter(range);

  const jobs = await prisma.job.findMany({
    where: {
      userId,
      createdAt: createdAtFilter,
      appliedAt: {
        not: null,
      },
    },
    select: {
      id: true,
      appliedAt: true,
      activities: {
        where: {
          type: "STATUS_CHANGED",
        },
        orderBy: {
          eventDate: "asc",
        },
        select: {
          eventDate: true,
          description: true,
        },
      },
    },
  });

  const responseTimes: number[] = [];

  for (const job of jobs) {
    if (!job.appliedAt) continue;

    const responseActivity = job.activities.find((activity) => {
      const description = activity.description ?? "";

      return (
        description.includes("APPLIED to SCREENING") ||
        description.includes("APPLIED to INTERVIEW") ||
        description.includes("APPLIED to OFFER") ||
        description.includes("APPLIED to REJECTED")
      );
    });

    if (!responseActivity) continue;

    const responseTime =
      responseActivity.eventDate.getTime() - job.appliedAt.getTime();

    // Ignore invalid data where the response occurred
    // before the application.
    if (responseTime >= 0) {
      responseTimes.push(responseTime);
    }
  }

  if (responseTimes.length === 0) {
    return 0;
  }

  const averageMilliseconds =
    responseTimes.reduce((sum, time) => sum + time, 0) / responseTimes.length;

  const averageHours = averageMilliseconds / (1000 * 60 * 60);

  return Math.round(averageHours * 10) / 10;
}
