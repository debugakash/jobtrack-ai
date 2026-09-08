import { beforeEach, describe, expect, it, vi } from "vitest";

import {
  getDashboardStats,
  getMonthlyApplications,
  getPendingFollowUps,
  getRecentActivity,
  getStatusDistribution,
  getTopCompanies,
  getUpcomingInterviews,
} from "../repositories/dashboard.repository.js";

import {
  getDashboardStatsService,
  getMonthlyApplicationsService,
  getPendingFollowUpsService,
  getRecentActivityService,
  getStatusDistributionService,
  getTopCompaniesService,
  getUpcomingInterviewsService,
} from "./dashboard.service.js";

vi.mock("../repositories/dashboard.repository.js", () => ({
  getDashboardStats: vi.fn(),
  getMonthlyApplications: vi.fn(),
  getPendingFollowUps: vi.fn(),
  getRecentActivity: vi.fn(),
  getStatusDistribution: vi.fn(),
  getTopCompanies: vi.fn(),
  getUpcomingInterviews: vi.fn(),
}));

const userId = "user-123";

describe("dashboard.service", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("getDashboardStatsService", () => {
    it("returns dashboard statistics", async () => {
      const stats = {
        totalApplications: 25,
        interviews: 5,
        offers: 2,
        rejected: 8,
      };

      vi.mocked(getDashboardStats).mockResolvedValue(stats as never);

      const result = await getDashboardStatsService(userId);

      expect(getDashboardStats).toHaveBeenCalledWith(userId);
      expect(result).toBe(stats);
    });
  });

  describe("getStatusDistributionService", () => {
    it("returns status distribution", async () => {
      const distribution = [
        { status: "APPLIED", count: 10 },
        { status: "INTERVIEW", count: 5 },
        { status: "REJECTED", count: 3 },
      ];

      vi.mocked(getStatusDistribution).mockResolvedValue(distribution as never);

      const result = await getStatusDistributionService(userId);

      expect(getStatusDistribution).toHaveBeenCalledWith(userId);
      expect(result).toBe(distribution);
    });
  });

  describe("getMonthlyApplicationsService", () => {
    it("returns six months including months with zero applications", async () => {
      vi.mocked(getMonthlyApplications).mockResolvedValue([]);

      const result = await getMonthlyApplicationsService(userId);

      expect(getMonthlyApplications).toHaveBeenCalledWith(userId);

      expect(result).toHaveLength(6);

      for (const month of result) {
        expect(month).toEqual(
          expect.objectContaining({
            month: expect.any(String),
            count: 0,
          }),
        );
      }
    });

    it("counts applications in their corresponding months", async () => {
      const now = new Date();

      const currentMonth = new Date(now.getFullYear(), now.getMonth(), 10);

      const previousMonth = new Date(now.getFullYear(), now.getMonth() - 1, 15);

      const olderMonth = new Date(now.getFullYear(), now.getMonth() - 5, 20);

      vi.mocked(getMonthlyApplications).mockResolvedValue([
        { createdAt: currentMonth },
        { createdAt: currentMonth },
        { createdAt: previousMonth },
        { createdAt: olderMonth },
      ] as never);

      const result = await getMonthlyApplicationsService(userId);

      const currentMonthLabel = currentMonth.toLocaleString("en-US", {
        month: "short",
        year: "numeric",
      });

      const previousMonthLabel = previousMonth.toLocaleString("en-US", {
        month: "short",
        year: "numeric",
      });

      const olderMonthLabel = olderMonth.toLocaleString("en-US", {
        month: "short",
        year: "numeric",
      });

      expect(
        result.find((item) => item.month === currentMonthLabel)?.count,
      ).toBe(2);

      expect(
        result.find((item) => item.month === previousMonthLabel)?.count,
      ).toBe(1);

      expect(result.find((item) => item.month === olderMonthLabel)?.count).toBe(
        1,
      );
    });

    it("ignores applications older than the six-month window", async () => {
      const now = new Date();

      const oldDate = new Date(now.getFullYear(), now.getMonth() - 7, 15);

      vi.mocked(getMonthlyApplications).mockResolvedValue([
        { createdAt: oldDate },
      ] as never);

      const result = await getMonthlyApplicationsService(userId);

      expect(result).toHaveLength(6);

      expect(result.every((month) => month.count === 0)).toBe(true);
    });
  });

  describe("getTopCompaniesService", () => {
    it("maps repository company results to company and count", async () => {
      const companies = [
        {
          company: "Google",
          _count: {
            company: 5,
          },
        },
        {
          company: "Microsoft",
          _count: {
            company: 3,
          },
        },
      ];

      vi.mocked(getTopCompanies).mockResolvedValue(companies as never);

      const result = await getTopCompaniesService(userId);

      expect(getTopCompanies).toHaveBeenCalledWith(userId);

      expect(result).toEqual([
        {
          company: "Google",
          count: 5,
        },
        {
          company: "Microsoft",
          count: 3,
        },
      ]);
    });

    it("returns an empty array when there are no companies", async () => {
      vi.mocked(getTopCompanies).mockResolvedValue([]);

      const result = await getTopCompaniesService(userId);

      expect(result).toEqual([]);
    });
  });

  describe("getPendingFollowUpsService", () => {
    it("returns pending follow-ups", async () => {
      const followUps = [
        {
          id: "job-1",
          company: "Google",
          followUpDate: new Date(),
        },
      ];

      vi.mocked(getPendingFollowUps).mockResolvedValue(followUps as never);

      const result = await getPendingFollowUpsService(userId);

      expect(getPendingFollowUps).toHaveBeenCalledWith(userId);
      expect(result).toBe(followUps);
    });
  });

  describe("getUpcomingInterviewsService", () => {
    it("returns upcoming interviews", async () => {
      const interviews = [
        {
          id: "interview-1",
          scheduledAt: new Date(),
          job: {
            company: "Google",
            jobTitle: "Frontend Developer",
          },
        },
      ];

      vi.mocked(getUpcomingInterviews).mockResolvedValue(interviews as never);

      const result = await getUpcomingInterviewsService(userId);

      expect(getUpcomingInterviews).toHaveBeenCalledWith(userId);
      expect(result).toBe(interviews);
    });
  });

  describe("getRecentActivityService", () => {
    it("returns paginated recent activity", async () => {
      const activity = {
        activities: [
          {
            id: "activity-1",
            title: "Application created",
          },
        ],
        total: 1,
      };

      vi.mocked(getRecentActivity).mockResolvedValue(activity as never);

      const result = await getRecentActivityService(userId, 2, 10);

      expect(getRecentActivity).toHaveBeenCalledWith(userId, 2, 10);

      expect(result).toBe(activity);
    });
  });
});
