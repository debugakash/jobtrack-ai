import { describe, expect, it, vi } from "vitest";

import { api } from "@/lib/api";
import { getFollowUps } from "./get-follow-ups";

vi.mock("@/lib/api", () => ({
  api: {
    get: vi.fn(),
  },
}));

describe("getFollowUps", () => {
  it("calls the follow-ups endpoint", async () => {
    vi.mocked(api.get).mockResolvedValue({
      data: {
        success: true,
        data: [],
      },
    } as never);

    await getFollowUps();

    expect(api.get).toHaveBeenCalledWith("/dashboard/follow-ups");
  });

  it("returns the follow-ups data", async () => {
    const followUps = [
      {
        id: "job-1",
        company: "Acme",
        jobTitle: "Frontend Developer",
        status: "APPLIED",
        followUpDate: "2026-09-01",
      },
    ];

    vi.mocked(api.get).mockResolvedValue({
      data: {
        success: true,
        data: followUps,
      },
    } as never);

    const result = await getFollowUps();

    expect(result).toEqual(followUps);
  });
});
