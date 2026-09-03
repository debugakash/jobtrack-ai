import { beforeEach, describe, expect, it, vi } from "vitest";

import { api } from "@/lib/api";

import { deleteInterview } from "./delete-interview";

vi.mock("@/lib/api", () => ({
  api: {
    delete: vi.fn(),
  },
}));

describe("deleteInterview", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("deletes the specified interview", async () => {
    const interviewId = "interview-123";

    vi.mocked(api.delete).mockResolvedValueOnce({} as never);

    await deleteInterview(interviewId);

    expect(api.delete).toHaveBeenCalledWith(`/interviews/${interviewId}`);
  });

  it("does not return a value after deleting the interview", async () => {
    const interviewId = "interview-456";

    vi.mocked(api.delete).mockResolvedValueOnce({} as never);

    const result = await deleteInterview(interviewId);

    expect(api.delete).toHaveBeenCalledWith(`/interviews/${interviewId}`);

    expect(result).toBeUndefined();
  });
});
