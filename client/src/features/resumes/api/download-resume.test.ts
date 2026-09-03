import { beforeEach, describe, expect, it, vi } from "vitest";

import { api } from "@/lib/api";

import { downloadResume } from "./download-resume";

vi.mock("@/lib/api", () => ({
  api: {
    get: vi.fn(),
  },
}));

describe("downloadResume", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    vi.spyOn(window.URL, "createObjectURL").mockReturnValue("blob:resume-url");

    vi.spyOn(window.URL, "revokeObjectURL").mockImplementation(() => {});
  });

  it("downloads the resume with the filename from the response header", async () => {
    const resumeId = "resume-123";

    const blobData = new Blob(["resume content"], {
      type: "application/pdf",
    });

    vi.mocked(api.get).mockResolvedValueOnce({
      data: blobData,
      headers: {
        "content-disposition": 'attachment; filename="my-resume.pdf"',
      },
    } as never);

    const clickSpy = vi
      .spyOn(HTMLAnchorElement.prototype, "click")
      .mockImplementation(() => {});

    await downloadResume(resumeId);

    expect(api.get).toHaveBeenCalledWith(`/resumes/${resumeId}/download`, {
      responseType: "blob",
    });

    expect(window.URL.createObjectURL).toHaveBeenCalledTimes(1);
    expect(clickSpy).toHaveBeenCalledTimes(1);

    expect(window.URL.revokeObjectURL).toHaveBeenCalledWith("blob:resume-url");

    clickSpy.mockRestore();
  });

  it("uses resume.pdf when the content-disposition header is missing", async () => {
    const resumeId = "resume-456";

    const blobData = new Blob(["resume content"], {
      type: "application/pdf",
    });

    vi.mocked(api.get).mockResolvedValueOnce({
      data: blobData,
      headers: {},
    } as never);

    const downloadSetter = vi
      .spyOn(HTMLAnchorElement.prototype, "download", "set")
      .mockImplementation(() => {});

    const clickSpy = vi
      .spyOn(HTMLAnchorElement.prototype, "click")
      .mockImplementation(() => {});

    await downloadResume(resumeId);

    expect(api.get).toHaveBeenCalledWith(`/resumes/${resumeId}/download`, {
      responseType: "blob",
    });

    expect(downloadSetter).toHaveBeenCalledWith("resume.pdf");
    expect(clickSpy).toHaveBeenCalledTimes(1);

    expect(window.URL.revokeObjectURL).toHaveBeenCalledWith("blob:resume-url");

    downloadSetter.mockRestore();
    clickSpy.mockRestore();
  });
});
