import { describe, expect, it, vi } from "vitest";

import { api } from "@/lib/api";
import { getDashboardStats } from "./get-dashboard-stats";

vi.mock("@/lib/api", () => ({
  api: {
    get: vi.fn(),
  },
}));

describe("getDashboardStats", () => {
  it("calls the dashboard stats endpoint", async () => {
    vi.mocked(api.get).mockResolvedValue({
      data: {
        success: true,
        data: {
          totalApplications: 10,
        },
      },
    } as never);

    await getDashboardStats();

    expect(api.get).toHaveBeenCalledWith("/dashboard/stats");
  });

  it("returns the dashboard stats data", async () => {
    const stats = {
      totalApplications: 10,
    };

    vi.mocked(api.get).mockResolvedValue({
      data: {
        success: true,
        data: stats,
      },
    } as never);

    const result = await getDashboardStats();

    expect(result).toEqual(stats);
  });
});
