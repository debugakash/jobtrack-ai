import { describe, expect, it, vi } from "vitest";

import { api } from "@/lib/api";

import { getAnalytics } from "./get-analytics";

describe("getAnalytics", () => {
  it("calls the API with the correct range param", async () => {
    const getSpy = vi.spyOn(api, "get").mockResolvedValue({
      data: {
        data: {},
      },
    } as never);

    await getAnalytics("6months");

    expect(getSpy).toHaveBeenCalledWith("/analytics", {
      params: {
        range: "6months",
      },
    });
  });

  it("returns the analytics data from the API response", async () => {
    const analytics = {
      applications: 25,
      interviews: 10,
    };

    vi.spyOn(api, "get").mockResolvedValue({
      data: {
        data: analytics,
      },
    } as never);

    const result = await getAnalytics("6months");

    expect(result).toEqual(analytics);
  });
});
