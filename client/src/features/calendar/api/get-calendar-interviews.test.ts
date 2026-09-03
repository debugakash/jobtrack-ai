import { describe, expect, it, vi } from "vitest";

import { api } from "@/lib/api";

import { getCalendarInterviews } from "./get-calendar-interviews";

describe("getCalendarInterviews", () => {
  it("calls the interviews endpoint", async () => {
    const getSpy = vi.spyOn(api, "get").mockResolvedValue({
      data: {
        data: [],
      },
    } as never);

    await getCalendarInterviews();

    expect(getSpy).toHaveBeenCalledWith("/interviews");
  });

  it("returns the interview data from the API response", async () => {
    const interviews = [
      {
        id: "interview-1",
      },
    ];

    vi.spyOn(api, "get").mockResolvedValue({
      data: {
        data: interviews,
      },
    } as never);

    const result = await getCalendarInterviews();

    expect(result).toEqual(interviews);
  });
});
