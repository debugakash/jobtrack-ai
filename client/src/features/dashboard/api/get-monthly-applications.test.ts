import { describe, expect, it, vi } from "vitest";

import { api } from "@/lib/api";
import { getMonthlyApplications } from "./get-monthly-applications";

vi.mock("@/lib/api", () => ({
  api: {
    get: vi.fn(),
  },
}));

describe("getMonthlyApplications", () => {
  it("calls the monthly applications endpoint", async () => {
    vi.mocked(api.get).mockResolvedValue({
      data: {
        success: true,
        data: [],
      },
    } as never);

    await getMonthlyApplications();

    expect(api.get).toHaveBeenCalledWith("/dashboard/monthly-applications");
  });

  it("returns the monthly applications data", async () => {
    const applications = [
      {
        month: "January",
        count: 5,
      },
      {
        month: "February",
        count: 8,
      },
    ];

    vi.mocked(api.get).mockResolvedValue({
      data: {
        success: true,
        data: applications,
      },
    } as never);

    const result = await getMonthlyApplications();

    expect(result).toEqual(applications);
  });
});
