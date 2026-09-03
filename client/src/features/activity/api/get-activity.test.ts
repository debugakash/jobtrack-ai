import { describe, expect, it, vi } from "vitest";

import { api } from "@/lib/api";

import { getActivity } from "./get-activity";

describe("getActivity", () => {
  it("calls the API with the correct pagination params", async () => {
    const getSpy = vi.spyOn(api, "get").mockResolvedValue({
      data: {
        data: [],
      },
    } as never);

    await getActivity(2, 10);

    expect(getSpy).toHaveBeenCalledWith("/dashboard/recent-activity", {
      params: {
        page: 2,
        limit: 10,
      },
    });
  });

  it("returns the activity data from the API response", async () => {
    const activity = [
      {
        id: "activity-1",
      },
    ];

    vi.spyOn(api, "get").mockResolvedValue({
      data: {
        data: activity,
      },
    } as never);

    const result = await getActivity();

    expect(result).toEqual(activity);
  });
});
