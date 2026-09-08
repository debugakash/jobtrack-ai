import { beforeEach, describe, expect, it, vi } from "vitest";

import {
  createResume,
  deleteResume,
  getResumeById,
  getResumes,
  updateResume,
} from "../repositories/resume.repository.js";

import { storageService } from "./storage/index.js";

import {
  createResumeService,
  deleteResumeService,
  downloadResumeService,
  getResumeByIdService,
  getResumesService,
  updateResumeService,
} from "./resume.service.js";

vi.mock("../repositories/resume.repository.js", () => ({
  createResume: vi.fn(),
  deleteResume: vi.fn(),
  getResumeById: vi.fn(),
  getResumes: vi.fn(),
  updateResume: vi.fn(),
}));

vi.mock("./storage/index.js", () => ({
  storageService: {
    upload: vi.fn(),
    delete: vi.fn(),
    download: vi.fn(),
  },
}));

const userId = "user-123";
const resumeId = "resume-123";

const mockFile = {
  originalname: "frontend-resume.pdf",
  mimetype: "application/pdf",
  size: 123456,
  buffer: Buffer.from("resume-content"),
} as Express.Multer.File;

const mockResume = {
  id: resumeId,
  userId,
  originalName: "frontend-resume.pdf",
  storedName: "abc-frontend-resume.pdf",
  filePath: "resumes/abc-frontend-resume.pdf",
  mimeType: "application/pdf",
  fileSize: 123456,
  label: "Frontend Resume",
  isDefault: false,
};

describe("resume.service", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("createResumeService", () => {
    it("uploads the file and creates a resume", async () => {
      vi.mocked(storageService.upload).mockResolvedValue({
        storedName: "abc-resume.pdf",
        filePath: "resumes/abc-resume.pdf",
      });

      vi.mocked(createResume).mockResolvedValue(mockResume as never);

      const result = await createResumeService(userId, mockFile, {
        label: "Frontend Resume",
        isDefault: false,
      });

      expect(storageService.upload).toHaveBeenCalledWith(mockFile, "resumes");

      expect(createResume).toHaveBeenCalledWith({
        originalName: "frontend-resume.pdf",
        storedName: "abc-resume.pdf",
        filePath: "resumes/abc-resume.pdf",
        mimeType: "application/pdf",
        fileSize: 123456,
        label: "Frontend Resume",
        isDefault: false,
        user: {
          connect: {
            id: userId,
          },
        },
      });

      expect(result).toBe(mockResume);
    });

    it("defaults isDefault to false when it is not provided", async () => {
      vi.mocked(storageService.upload).mockResolvedValue({
        storedName: "abc-resume.pdf",
        filePath: "resumes/abc-resume.pdf",
      });

      vi.mocked(createResume).mockResolvedValue(mockResume as never);

      await createResumeService(userId, mockFile, {
        label: "Resume",
      });

      expect(createResume).toHaveBeenCalledWith(
        expect.objectContaining({
          isDefault: false,
        }),
      );
    });

    it("unsets existing default resumes before creating a default resume", async () => {
      const existingResumes = [
        { id: "resume-1", isDefault: true },
        { id: "resume-2", isDefault: false },
      ];

      vi.mocked(getResumes).mockResolvedValue(existingResumes as never);

      vi.mocked(updateResume).mockResolvedValue({
        count: 1,
      });

      vi.mocked(storageService.upload).mockResolvedValue({
        storedName: "new-resume.pdf",
        filePath: "resumes/new-resume.pdf",
      });

      vi.mocked(createResume).mockResolvedValue(mockResume as never);

      await createResumeService(userId, mockFile, {
        label: "Default Resume",
        isDefault: true,
      });

      expect(getResumes).toHaveBeenCalledWith(userId);

      expect(updateResume).toHaveBeenCalledTimes(2);

      expect(updateResume).toHaveBeenNthCalledWith(1, userId, "resume-1", {
        isDefault: false,
      });

      expect(updateResume).toHaveBeenNthCalledWith(2, userId, "resume-2", {
        isDefault: false,
      });
    });

    it("does not fetch existing resumes when creating a non-default resume", async () => {
      vi.mocked(storageService.upload).mockResolvedValue({
        storedName: "resume.pdf",
        filePath: "resumes/resume.pdf",
      });

      vi.mocked(createResume).mockResolvedValue(mockResume as never);

      await createResumeService(userId, mockFile, {
        label: "Resume",
        isDefault: false,
      });

      expect(getResumes).not.toHaveBeenCalled();
      expect(updateResume).not.toHaveBeenCalled();
    });
  });

  describe("getResumesService", () => {
    it("gets all resumes for the user", async () => {
      const resumes = [mockResume];

      vi.mocked(getResumes).mockResolvedValue(resumes as never);

      const result = await getResumesService(userId);

      expect(getResumes).toHaveBeenCalledWith(userId);
      expect(result).toBe(resumes);
    });
  });

  describe("getResumeByIdService", () => {
    it("returns the resume when found", async () => {
      vi.mocked(getResumeById).mockResolvedValue(mockResume as never);

      const result = await getResumeByIdService(userId, resumeId);

      expect(getResumeById).toHaveBeenCalledWith(userId, resumeId);
      expect(result).toBe(mockResume);
    });

    it("throws NotFoundError when the resume does not exist", async () => {
      vi.mocked(getResumeById).mockResolvedValue(null);

      await expect(getResumeByIdService(userId, resumeId)).rejects.toThrow(
        "Resume not found.",
      );

      expect(getResumeById).toHaveBeenCalledWith(userId, resumeId);
    });
  });

  describe("updateResumeService", () => {
    it("updates the resume and returns the updated resume", async () => {
      const updatedResume = {
        ...mockResume,
        label: "Updated Resume",
      };

      vi.mocked(getResumeById)
        .mockResolvedValueOnce(mockResume as never)
        .mockResolvedValueOnce(updatedResume as never);

      vi.mocked(updateResume).mockResolvedValue({
        count: 1,
      });

      const result = await updateResumeService(userId, resumeId, {
        label: "Updated Resume",
      });

      expect(updateResume).toHaveBeenCalledWith(userId, resumeId, {
        label: "Updated Resume",
      });

      expect(result).toBe(updatedResume);
    });

    it("throws NotFoundError when the resume does not exist", async () => {
      vi.mocked(getResumeById).mockResolvedValue(null);

      await expect(
        updateResumeService(userId, resumeId, {
          label: "Updated Resume",
        }),
      ).rejects.toThrow("Resume not found.");

      expect(updateResume).not.toHaveBeenCalled();
    });

    it("unsets all existing defaults when making a resume default", async () => {
      const resumes = [
        { id: "resume-1", isDefault: true },
        { id: "resume-2", isDefault: false },
      ];

      vi.mocked(getResumeById)
        .mockResolvedValueOnce(mockResume as never)
        .mockResolvedValueOnce({
          ...mockResume,
          isDefault: true,
        } as never);

      vi.mocked(getResumes).mockResolvedValue(resumes as never);

      vi.mocked(updateResume).mockResolvedValue({
        count: 1,
      });

      await updateResumeService(userId, resumeId, {
        isDefault: true,
      });

      expect(getResumes).toHaveBeenCalledWith(userId);

      expect(updateResume).toHaveBeenCalledTimes(3);

      expect(updateResume).toHaveBeenNthCalledWith(1, userId, "resume-1", {
        isDefault: false,
      });

      expect(updateResume).toHaveBeenNthCalledWith(2, userId, "resume-2", {
        isDefault: false,
      });

      expect(updateResume).toHaveBeenNthCalledWith(3, userId, resumeId, {
        isDefault: true,
      });
    });

    it("does not fetch all resumes when isDefault is false", async () => {
      vi.mocked(getResumeById)
        .mockResolvedValueOnce(mockResume as never)
        .mockResolvedValueOnce({
          ...mockResume,
          label: "Updated",
        } as never);

      vi.mocked(updateResume).mockResolvedValue({
        count: 1,
      });

      await updateResumeService(userId, resumeId, {
        label: "Updated",
        isDefault: false,
      });

      expect(getResumes).not.toHaveBeenCalled();

      expect(updateResume).toHaveBeenCalledWith(userId, resumeId, {
        label: "Updated",
        isDefault: false,
      });
    });
  });

  describe("deleteResumeService", () => {
    it("deletes the file from storage and then deletes the database record", async () => {
      vi.mocked(getResumeById).mockResolvedValue(mockResume as never);

      vi.mocked(storageService.delete).mockResolvedValue(undefined);

      vi.mocked(deleteResume).mockResolvedValue({
        count: 1,
      });

      await deleteResumeService(userId, resumeId);

      expect(storageService.delete).toHaveBeenCalledWith(mockResume.filePath);

      expect(deleteResume).toHaveBeenCalledWith(userId, resumeId);
    });

    it("throws NotFoundError when the resume does not exist", async () => {
      vi.mocked(getResumeById).mockResolvedValue(null);

      await expect(deleteResumeService(userId, resumeId)).rejects.toThrow(
        "Resume not found.",
      );

      expect(storageService.delete).not.toHaveBeenCalled();
      expect(deleteResume).not.toHaveBeenCalled();
    });
  });

  describe("downloadResumeService", () => {
    it("downloads the resume file and returns it with the resume", async () => {
      const fileBuffer = Buffer.from("resume-content");

      vi.mocked(getResumeById).mockResolvedValue(mockResume as never);

      vi.mocked(storageService.download).mockResolvedValue(fileBuffer);

      const result = await downloadResumeService(userId, resumeId);

      expect(getResumeById).toHaveBeenCalledWith(userId, resumeId);

      expect(storageService.download).toHaveBeenCalledWith(mockResume.filePath);

      expect(result).toEqual({
        resume: mockResume,
        fileBuffer,
      });
    });

    it("throws NotFoundError when downloading a missing resume", async () => {
      vi.mocked(getResumeById).mockResolvedValue(null);

      await expect(downloadResumeService(userId, resumeId)).rejects.toThrow(
        "Resume not found.",
      );

      expect(storageService.download).not.toHaveBeenCalled();
    });
  });
});
