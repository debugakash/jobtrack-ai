import { beforeEach, describe, expect, it, vi } from "vitest";

import {
  getAnalyticsOverview,
  getMonthlyApplications,
  getStatusDistribution,
  getSourceDistribution,
  getApplicationFunnel,
  getAverageTimeToInterview,
  getAverageTimeToResponse,
} from "../repositories/analytics.repository.js";

import { getAnalytics } from "./analytics.service.js";

vi.mock("../repositories/analytics.repository.js", () => ({
  getAnalyticsOverview: vi.fn(),
  getMonthlyApplications: vi.fn(),
  getStatusDistribution: vi.fn(),
  getSourceDistribution: vi.fn(),
  getApplicationFunnel: vi.fn(),
  getAverageTimeToInterview: vi.fn(),
  getAverageTimeToResponse: vi.fn(),
}));

const userId = "user-123";

describe("analytics.service", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("getAnalytics", () => {
    it("passes userId and range to all applicable repository functions", async () => {
      const range = 30;

      vi.mocked(getAnalyticsOverview).mockResolvedValue("overview" as never);
      vi.mocked(getMonthlyApplications).mockResolvedValue(
        "monthlyApplications" as never,
      );
      vi.mocked(getStatusDistribution).mockResolvedValue(
        "statusDistribution" as never,
      );
      vi.mocked(getSourceDistribution).mockResolvedValue(
        "sourceDistribution" as never,
      );
      vi.mocked(getApplicationFunnel).mockResolvedValue(
        "applicationFunnel" as never,
      );
      vi.mocked(getAverageTimeToInterview).mockResolvedValue(
        "averageTimeToInterview" as never,
      );
      vi.mocked(getAverageTimeToResponse).mockResolvedValue(
        "averageTimeToResponse" as never,
      );

      await getAnalytics(userId, range);

      expect(getAnalyticsOverview).toHaveBeenCalledWith(userId, range);
      expect(getMonthlyApplications).toHaveBeenCalledWith(userId, range);
      expect(getStatusDistribution).toHaveBeenCalledWith(userId, range);
      expect(getSourceDistribution).toHaveBeenCalledWith(userId, range);
      expect(getApplicationFunnel).toHaveBeenCalledWith(userId, range);
      expect(getAverageTimeToInterview).toHaveBeenCalledWith(userId);
      expect(getAverageTimeToResponse).toHaveBeenCalledWith(userId, range);
    });

    it('supports the "all" range', async () => {
      vi.mocked(getAnalyticsOverview).mockResolvedValue("overview" as never);
      vi.mocked(getMonthlyApplications).mockResolvedValue(
        "monthlyApplications" as never,
      );
      vi.mocked(getStatusDistribution).mockResolvedValue(
        "statusDistribution" as never,
      );
      vi.mocked(getSourceDistribution).mockResolvedValue(
        "sourceDistribution" as never,
      );
      vi.mocked(getApplicationFunnel).mockResolvedValue(
        "applicationFunnel" as never,
      );
      vi.mocked(getAverageTimeToInterview).mockResolvedValue(
        "averageTimeToInterview" as never,
      );
      vi.mocked(getAverageTimeToResponse).mockResolvedValue(
        "averageTimeToResponse" as never,
      );

      const result = await getAnalytics(userId, "all");

      expect(getAnalyticsOverview).toHaveBeenCalledWith(userId, "all");
      expect(getMonthlyApplications).toHaveBeenCalledWith(userId, "all");
      expect(getStatusDistribution).toHaveBeenCalledWith(userId, "all");
      expect(getSourceDistribution).toHaveBeenCalledWith(userId, "all");
      expect(getApplicationFunnel).toHaveBeenCalledWith(userId, "all");
      expect(getAverageTimeToInterview).toHaveBeenCalledWith(userId);
      expect(getAverageTimeToResponse).toHaveBeenCalledWith(userId, "all");

      expect(result).toEqual({
        overview: "overview",
        monthlyApplications: "monthlyApplications",
        statusDistribution: "statusDistribution",
        sourceDistribution: "sourceDistribution",
        applicationFunnel: "applicationFunnel",
        averageTimeToInterview: "averageTimeToInterview",
        averageTimeToResponse: "averageTimeToResponse",
      });
    });

    it("returns all analytics results from the repositories", async () => {
      const overview = { totalApplications: 25 };
      const monthlyApplications = [{ month: "Sep 2026", count: 5 }];
      const statusDistribution = [{ status: "APPLIED", count: 10 }];
      const sourceDistribution = [{ source: "LINKEDIN", count: 8 }];
      const applicationFunnel = [{ stage: "APPLIED", count: 10 }];
      const averageTimeToInterview = 12.5;
      const averageTimeToResponse = 4.5;

      vi.mocked(getAnalyticsOverview).mockResolvedValue(overview as never);
      vi.mocked(getMonthlyApplications).mockResolvedValue(
        monthlyApplications as never,
      );
      vi.mocked(getStatusDistribution).mockResolvedValue(
        statusDistribution as never,
      );
      vi.mocked(getSourceDistribution).mockResolvedValue(
        sourceDistribution as never,
      );
      vi.mocked(getApplicationFunnel).mockResolvedValue(
        applicationFunnel as never,
      );
      vi.mocked(getAverageTimeToInterview).mockResolvedValue(
        averageTimeToInterview as never,
      );
      vi.mocked(getAverageTimeToResponse).mockResolvedValue(
        averageTimeToResponse as never,
      );

      const result = await getAnalytics(userId, 90);

      expect(result).toEqual({
        overview,
        monthlyApplications,
        statusDistribution,
        sourceDistribution,
        applicationFunnel,
        averageTimeToInterview,
        averageTimeToResponse,
      });
    });

    it("propagates repository errors", async () => {
      const error = new Error("Database unavailable");

      vi.mocked(getAnalyticsOverview).mockRejectedValue(error);

      vi.mocked(getMonthlyApplications).mockResolvedValue([] as never);
      vi.mocked(getStatusDistribution).mockResolvedValue([] as never);
      vi.mocked(getSourceDistribution).mockResolvedValue([] as never);
      vi.mocked(getApplicationFunnel).mockResolvedValue([] as never);
      vi.mocked(getAverageTimeToInterview).mockResolvedValue(null as never);
      vi.mocked(getAverageTimeToResponse).mockResolvedValue(null as never);

      await expect(getAnalytics(userId, 30)).rejects.toThrow(
        "Database unavailable",
      );
    });
  });
});
