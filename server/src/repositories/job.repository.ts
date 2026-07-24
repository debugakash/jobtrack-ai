import prisma from "../config/prisma.js";
import { JobStatus, JobType, Prisma, WorkMode } from "@prisma/client";
import { GetJobsQueryDto, GetJobsResultDto } from "../dtos/job.dto.js";

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
  followUpDate?: Date;
  followUpDone?: boolean;
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

export async function getJobsByUserId(
  userId: string,
  query: GetJobsQueryDto,
): Promise<GetJobsResultDto> {
  const { search, status, jobType, workMode, sort, page, limit } = query;

  const where = {
    userId,

    ...(search && {
      OR: [
        {
          company: {
            contains: search,
            mode: "insensitive" as const,
          },
        },
        {
          jobTitle: {
            contains: search,
            mode: "insensitive" as const,
          },
        },
      ],
    }),

    ...(status && { status }),

    ...(jobType && { jobType }),

    ...(workMode && { workMode }),
  };

  const orderBy =
    sort === "oldest"
      ? { createdAt: "asc" as const }
      : sort === "company_asc"
        ? { company: "asc" as const }
        : sort === "company_desc"
          ? { company: "desc" as const }
          : sort === "salary_asc"
            ? { salaryMin: "asc" as const }
            : sort === "salary_desc"
              ? { salaryMin: "desc" as const }
              : { createdAt: "desc" as const };

  const [jobs, total] = await Promise.all([
    prisma.job.findMany({
      where,
      orderBy,
      skip: (page - 1) * limit,
      take: limit,
    }),

    prisma.job.count({
      where,
    }),
  ]);

  return {
    jobs,
    total,
  };
}

export function getJobById(userId: string, jobId: string) {
  return prisma.job.findFirst({
    where: {
      id: jobId,
      userId,
    },

    include: {
      activities: {
        orderBy: {
          eventDate: "desc",
        },
      },

      interviews: {
        orderBy: {
          scheduledAt: "asc",
        },
      },

      resume: true,
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

export function deleteJob(userId: string, jobId: string) {
  return prisma.job.deleteMany({
    where: {
      id: jobId,
      userId,
    },
  });
}
