import { beforeEach, describe, expect, it, vi } from "vitest";

import prisma from "../config/prisma.js";

import {
  createJob,
  deleteJob,
  getJobById,
  getJobsByUserId,
  updateJob,
} from "./job.repository.js";

vi.mock("../config/prisma.js", () => ({
  default: {
    job: {
      create: vi.fn(),
      findMany: vi.fn(),
      count: vi.fn(),
      findFirst: vi.fn(),
      updateMany: vi.fn(),
      deleteMany: vi.fn(),
    },
  },
}));

const userId = "user-123";
const jobId = "job-123";

const baseJobData = {
  company: "Acme Corp",
  jobTitle: "Frontend Developer",
  jobType: "FULL_TIME" as const,
  workMode: "REMOTE" as const,
  user: {
    connect: {
      id: userId,
    },
  },
};

const mockJob = {
  id: jobId,
  userId,
  company: "Acme Corp",
  jobTitle: "Frontend Developer",
};

describe("job.repository", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("createJob", () => {
    it("creates a job with the provided data", async () => {
      vi.mocked(prisma.job.create).mockResolvedValue(mockJob as never);

      const result = await createJob(baseJobData);

      expect(prisma.job.create).toHaveBeenCalledWith({
        data: baseJobData,
      });

      expect(result).toBe(mockJob);
    });
  });

  describe("getJobsByUserId", () => {
    it("fetches jobs for the specified user with pagination", async () => {
      const jobs = [mockJob];

      vi.mocked(prisma.job.findMany).mockResolvedValue(jobs as never);
      vi.mocked(prisma.job.count).mockResolvedValue(1);

      const result = await getJobsByUserId(userId, {
        page: 2,
        limit: 10,
      });

      expect(prisma.job.findMany).toHaveBeenCalledWith({
        where: {
          userId,
        },
        orderBy: {
          createdAt: "desc",
        },
        skip: 10,
        take: 10,
      });

      expect(prisma.job.count).toHaveBeenCalledWith({
        where: {
          userId,
        },
      });

      expect(result).toEqual({
        jobs,
        total: 1,
      });
    });

    it("filters jobs by search term", async () => {
      vi.mocked(prisma.job.findMany).mockResolvedValue([]);
      vi.mocked(prisma.job.count).mockResolvedValue(0);

      await getJobsByUserId(userId, {
        search: "react",
        page: 1,
        limit: 10,
      });

      const expectedWhere = {
        userId,
        OR: [
          {
            company: {
              contains: "react",
              mode: "insensitive",
            },
          },
          {
            jobTitle: {
              contains: "react",
              mode: "insensitive",
            },
          },
        ],
      };

      expect(prisma.job.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expectedWhere,
        }),
      );

      expect(prisma.job.count).toHaveBeenCalledWith({
        where: expectedWhere,
      });
    });

    it("filters jobs by status", async () => {
      vi.mocked(prisma.job.findMany).mockResolvedValue([]);
      vi.mocked(prisma.job.count).mockResolvedValue(0);

      await getJobsByUserId(userId, {
        status: "INTERVIEW",
        page: 1,
        limit: 10,
      });

      expect(prisma.job.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: {
            userId,
            status: "INTERVIEW",
          },
        }),
      );
    });

    it("filters jobs by job type and work mode", async () => {
      vi.mocked(prisma.job.findMany).mockResolvedValue([]);
      vi.mocked(prisma.job.count).mockResolvedValue(0);

      await getJobsByUserId(userId, {
        jobType: "FULL_TIME",
        workMode: "REMOTE",
        page: 1,
        limit: 10,
      });

      expect(prisma.job.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: {
            userId,
            jobType: "FULL_TIME",
            workMode: "REMOTE",
          },
        }),
      );
    });

    it("applies the oldest sort order", async () => {
      vi.mocked(prisma.job.findMany).mockResolvedValue([]);
      vi.mocked(prisma.job.count).mockResolvedValue(0);

      await getJobsByUserId(userId, {
        sort: "oldest",
        page: 1,
        limit: 10,
      });

      expect(prisma.job.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          orderBy: {
            createdAt: "asc",
          },
        }),
      );
    });

    it("applies company ascending sort order", async () => {
      vi.mocked(prisma.job.findMany).mockResolvedValue([]);
      vi.mocked(prisma.job.count).mockResolvedValue(0);

      await getJobsByUserId(userId, {
        sort: "company_asc",
        page: 1,
        limit: 10,
      });

      expect(prisma.job.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          orderBy: {
            company: "asc",
          },
        }),
      );
    });

    it("applies company descending sort order", async () => {
      vi.mocked(prisma.job.findMany).mockResolvedValue([]);
      vi.mocked(prisma.job.count).mockResolvedValue(0);

      await getJobsByUserId(userId, {
        sort: "company_desc",
        page: 1,
        limit: 10,
      });

      expect(prisma.job.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          orderBy: {
            company: "desc",
          },
        }),
      );
    });

    it("applies salary ascending sort order", async () => {
      vi.mocked(prisma.job.findMany).mockResolvedValue([]);
      vi.mocked(prisma.job.count).mockResolvedValue(0);

      await getJobsByUserId(userId, {
        sort: "salary_asc",
        page: 1,
        limit: 10,
      });

      expect(prisma.job.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          orderBy: {
            salaryMin: "asc",
          },
        }),
      );
    });

    it("applies salary descending sort order", async () => {
      vi.mocked(prisma.job.findMany).mockResolvedValue([]);
      vi.mocked(prisma.job.count).mockResolvedValue(0);

      await getJobsByUserId(userId, {
        sort: "salary_desc",
        page: 1,
        limit: 10,
      });

      expect(prisma.job.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          orderBy: {
            salaryMin: "desc",
          },
        }),
      );
    });
  });

  describe("getJobById", () => {
    it("finds a job by id and user id with all required relations", async () => {
      vi.mocked(prisma.job.findFirst).mockResolvedValue(mockJob as never);

      const result = await getJobById(userId, jobId);

      expect(prisma.job.findFirst).toHaveBeenCalledWith({
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
          aiAnalysis: true,
        },
      });

      expect(result).toBe(mockJob);
    });

    it("returns null when the job is not found", async () => {
      vi.mocked(prisma.job.findFirst).mockResolvedValue(null);

      const result = await getJobById(userId, "missing-job");

      expect(result).toBeNull();
    });
  });

  describe("updateJob", () => {
    it("updates only the job belonging to the specified user", async () => {
      const updateData = {
        company: "Updated Corp",
      };

      vi.mocked(prisma.job.updateMany).mockResolvedValue({
        count: 1,
      });

      const result = await updateJob(userId, jobId, updateData);

      expect(prisma.job.updateMany).toHaveBeenCalledWith({
        where: {
          id: jobId,
          userId,
        },
        data: updateData,
      });

      expect(result).toEqual({
        count: 1,
      });
    });

    it("returns count zero when no matching job exists", async () => {
      vi.mocked(prisma.job.updateMany).mockResolvedValue({
        count: 0,
      });

      const result = await updateJob(userId, jobId, {
        company: "Updated Corp",
      });

      expect(result).toEqual({
        count: 0,
      });
    });
  });

  describe("deleteJob", () => {
    it("deletes only the job belonging to the specified user", async () => {
      vi.mocked(prisma.job.deleteMany).mockResolvedValue({
        count: 1,
      });

      const result = await deleteJob(userId, jobId);

      expect(prisma.job.deleteMany).toHaveBeenCalledWith({
        where: {
          id: jobId,
          userId,
        },
      });

      expect(result).toEqual({
        count: 1,
      });
    });

    it("returns count zero when no matching job exists", async () => {
      vi.mocked(prisma.job.deleteMany).mockResolvedValue({
        count: 0,
      });

      const result = await deleteJob(userId, "missing-job");

      expect(result).toEqual({
        count: 0,
      });
    });
  });
});
