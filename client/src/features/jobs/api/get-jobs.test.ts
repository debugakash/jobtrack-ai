import { describe, expect, it, vi } from "vitest";

import { api } from "@/lib/api";

import { getJobs } from "./get-jobs";

vi.mock("@/lib/api", () => ({
  api: {
    get: vi.fn(),
  },
}));

describe("getJobs", () => {
  it("sends the provided filters and pagination parameters", async () => {
    const params = {
      search: "React",
      status: "APPLIED",
      jobType: "FULL_TIME",
      workMode: "REMOTE",
      sort: "createdAt:desc",
      page: 2,
      limit: 10,
    };

    const responseData = {
      success: true,
      data: [
        {
          id: "job-123",
          company: "Google",
          jobTitle: "React Developer",
        },
      ],
      pagination: {
        page: 2,
        limit: 10,
        total: 25,
        totalPages: 3,
        hasNextPage: true,
        hasPreviousPage: true,
      },
    };

    vi.mocked(api.get).mockResolvedValueOnce({
      data: responseData,
    } as never);

    const result = await getJobs(params);

    expect(api.get).toHaveBeenCalledWith("/jobs", {
      params,
    });

    expect(result).toEqual(responseData);
  });

  it("works with an empty parameter object", async () => {
    const responseData = {
      success: true,
      data: [],
      pagination: {
        page: 1,
        limit: 10,
        total: 0,
        totalPages: 0,
        hasNextPage: false,
        hasPreviousPage: false,
      },
    };

    vi.mocked(api.get).mockResolvedValueOnce({
      data: responseData,
    } as never);

    const result = await getJobs({});

    expect(api.get).toHaveBeenCalledWith("/jobs", {
      params: {},
    });

    expect(result).toEqual(responseData);
  });
});
