import { describe, expect, it, vi } from "vitest";

import { api } from "@/lib/api";
import { getRecentActivity } from "./get-recent-activity";

vi.mock("@/lib/api", () => ({
  api: {
    get: vi.fn(),
  },
}));

describe("getRecentActivity", () => {
  it("calls the recent activity endpoint", async () => {
    vi.mocked(api.get).mockResolvedValue({
      data: {
        success: true,
        data: [],
      },
    } as never);

    await getRecentActivity();

    expect(api.get).toHaveBeenCalledWith("/dashboard/recent-activity");
  });

  it("returns the recent activity data", async () => {
    const activities = [
      {
        id: "activity-1",
      },
    ];

    vi.mocked(api.get).mockResolvedValue({
      data: {
        success: true,
        data: activities,
      },
    } as never);

    const result = await getRecentActivity();

    expect(result).toEqual(activities);
  });
});
