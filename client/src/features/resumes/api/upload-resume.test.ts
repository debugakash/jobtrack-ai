import { beforeEach, describe, expect, it, vi } from "vitest";

import { api } from "@/lib/api";

import { uploadResume } from "./upload-resume";

vi.mock("@/lib/api", () => ({
  api: {
    post: vi.fn(),
  },
}));

describe("uploadResume", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("uploads the resume file with the label", async () => {
    const file = new File(["resume content"], "my-resume.pdf", {
      type: "application/pdf",
    });

    const uploadedResume = {
      id: "resume-123",
      label: "Frontend Resume",
    };

    vi.mocked(api.post).mockResolvedValueOnce({
      data: {
        data: uploadedResume,
      },
    } as never);

    const result = await uploadResume(file, "Frontend Resume");

    expect(api.post).toHaveBeenCalledTimes(1);

    const [url, formData, config] = vi.mocked(api.post).mock.calls[0];

    expect(url).toBe("/resumes");
    expect(formData).toBeInstanceOf(FormData);

    expect((formData as FormData).get("resume")).toBe(file);
    expect((formData as FormData).get("label")).toBe("Frontend Resume");

    expect(config).toEqual({
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    expect(result).toEqual(uploadedResume);
  });

  it("uploads the resume without a label when no label is provided", async () => {
    const file = new File(["resume content"], "resume.pdf", {
      type: "application/pdf",
    });

    vi.mocked(api.post).mockResolvedValueOnce({
      data: {
        data: {
          id: "resume-456",
        },
      },
    } as never);

    await uploadResume(file);

    expect(api.post).toHaveBeenCalledTimes(1);

    const [url, formData, config] = vi.mocked(api.post).mock.calls[0];

    expect(url).toBe("/resumes");
    expect(formData).toBeInstanceOf(FormData);

    expect((formData as FormData).get("resume")).toBe(file);
    expect((formData as FormData).get("label")).toBeNull();

    expect(config).toEqual({
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  });
});
