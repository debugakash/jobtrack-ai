import { describe, expect, it, vi } from "vitest";

import { api } from "@/lib/api";
import { getStatusDistribution } from "./get-status-distribution";

vi.mock("@/lib/api", () => ({
  api: {
    get: vi.fn(),
  },
}));

describe("getStatusDistribution", () => {
  it("calls the status distribution endpoint", async () => {
    vi.mocked(api.get).mockResolvedValue({
      data: {
        success: true,
        data: [],
      },
    } as never);

    await getStatusDistribution();

    expect(api.get).toHaveBeenCalledWith("/dashboard/status-distribution");
  });

  it("returns the status distribution data", async () => {
    const distribution = [
      {
        status: "APPLIED",
        count: 10,
      },
      {
        status: "INTERVIEW",
        count: 4,
      },
    ];

    vi.mocked(api.get).mockResolvedValue({
      data: {
        success: true,
        data: distribution,
      },
    } as never);

    const result = await getStatusDistribution();

    expect(result).toEqual(distribution);
  });
});
