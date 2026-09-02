import { describe, expect, it, vi } from "vitest";

import { api } from "@/lib/api";

import { deleteJob } from "./delete-job";

vi.mock("@/lib/api", () => ({
  api: {
    delete: vi.fn(),
  },
}));

describe("deleteJob", () => {
  it("sends a DELETE request for the specified job", async () => {
    const responseData = {
      success: true,
      message: "Job deleted successfully",
    };

    vi.mocked(api.delete).mockResolvedValueOnce({
      data: responseData,
    } as never);

    const result = await deleteJob("job-123");

    expect(api.delete).toHaveBeenCalledWith("/jobs/job-123");
    expect(result).toEqual(responseData);
  });

  it("returns the API response data", async () => {
    const responseData = {
      success: true,
    };

    vi.mocked(api.delete).mockResolvedValueOnce({
      data: responseData,
    } as never);

    const result = await deleteJob("job-456");

    expect(result).toEqual(responseData);
  });
});
