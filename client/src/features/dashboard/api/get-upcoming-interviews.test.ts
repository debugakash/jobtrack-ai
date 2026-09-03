import { describe, expect, it, vi } from "vitest";

import { api } from "@/lib/api";
import { getUpcomingInterviews } from "./get-upcoming-interviews";

vi.mock("@/lib/api", () => ({
  api: {
    get: vi.fn(),
  },
}));

describe("getUpcomingInterviews", () => {
  it("calls the upcoming interviews endpoint", async () => {
    vi.mocked(api.get).mockResolvedValue({
      data: {
        success: true,
        data: [],
      },
    } as never);

    await getUpcomingInterviews();

    expect(api.get).toHaveBeenCalledWith("/dashboard/upcoming-interviews");
  });

  it("returns the upcoming interviews data", async () => {
    const interviews = [
      {
        id: "interview-1",
      },
    ];

    vi.mocked(api.get).mockResolvedValue({
      data: {
        success: true,
        data: interviews,
      },
    } as never);

    const result = await getUpcomingInterviews();

    expect(result).toEqual(interviews);
  });
});
