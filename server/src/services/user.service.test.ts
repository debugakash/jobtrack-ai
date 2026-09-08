import { beforeEach, describe, expect, it, vi } from "vitest";

import {
  deleteUser,
  findUserById,
  updateUser,
  updateUserPreferences,
} from "../repositories/user.repository.js";

import { storageService } from "./storage/index.js";

import {
  deleteUserService,
  updateUserPreferencesService,
  updateUserProfile,
} from "./user.service.js";

vi.mock("../repositories/user.repository.js", () => ({
  deleteUser: vi.fn(),
  findUserById: vi.fn(),
  updateUser: vi.fn(),
  updateUserPreferences: vi.fn(),
}));

vi.mock("./storage/index.js", () => ({
  storageService: {
    delete: vi.fn(),
  },
}));

const userId = "user-123";

const mockUser = {
  id: userId,
  firstName: "Akash",
  lastName: "Arya",
  email: "akash@example.com",
  avatar: null,
  resumes: [],
};

describe("user.service", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("updateUserProfile", () => {
    it("updates the user profile when the user exists", async () => {
      const profileData = {
        firstName: "Updated",
        lastName: "User",
        phone: "9876543210",
      };

      vi.mocked(findUserById).mockResolvedValue(mockUser as never);

      const updatedUser = {
        ...mockUser,
        ...profileData,
      };

      vi.mocked(updateUser).mockResolvedValue(updatedUser as never);

      const result = await updateUserProfile(userId, profileData);

      expect(findUserById).toHaveBeenCalledWith(userId);

      expect(updateUser).toHaveBeenCalledWith(userId, profileData);

      expect(result).toBe(updatedUser);
    });

    it("throws NotFoundError when the user does not exist", async () => {
      vi.mocked(findUserById).mockResolvedValue(null);

      await expect(
        updateUserProfile(userId, {
          firstName: "Updated",
          lastName: "User",
        }),
      ).rejects.toThrow("User not found");

      expect(updateUser).not.toHaveBeenCalled();
    });
  });

  describe("updateUserPreferencesService", () => {
    it("updates user preferences", async () => {
      const preferences = {
        emailNotifications: true,
        interviewReminders: false,
        followUpReminders: true,
      };

      const updatedUser = {
        ...mockUser,
        ...preferences,
      };

      vi.mocked(updateUserPreferences).mockResolvedValue(updatedUser as never);

      const result = await updateUserPreferencesService(userId, preferences);

      expect(updateUserPreferences).toHaveBeenCalledWith(userId, preferences);

      expect(result).toBe(updatedUser);
    });

    it("passes the provided preference values without modification", async () => {
      const preferences = {
        emailNotifications: false,
        interviewReminders: true,
        followUpReminders: false,
      };

      vi.mocked(updateUserPreferences).mockResolvedValue(mockUser as never);

      await updateUserPreferencesService(userId, preferences);

      expect(updateUserPreferences).toHaveBeenCalledTimes(1);
      expect(updateUserPreferences).toHaveBeenCalledWith(userId, preferences);
    });
  });

  describe("deleteUserService", () => {
    it("deletes the user and cleans up resume files", async () => {
      const user = {
        ...mockUser,
        resumes: [
          {
            id: "resume-1",
            filePath: "resumes/resume-1.pdf",
          },
          {
            id: "resume-2",
            filePath: "resumes/resume-2.pdf",
          },
        ],
      };

      vi.mocked(deleteUser).mockResolvedValue(user as never);
      vi.mocked(storageService.delete).mockResolvedValue(undefined);

      const result = await deleteUserService(userId);

      expect(deleteUser).toHaveBeenCalledWith(userId);

      expect(storageService.delete).toHaveBeenCalledTimes(2);

      expect(storageService.delete).toHaveBeenNthCalledWith(
        1,
        "resumes/resume-1.pdf",
      );

      expect(storageService.delete).toHaveBeenNthCalledWith(
        2,
        "resumes/resume-2.pdf",
      );

      expect(result).toBe(user);
    });

    it("deletes the avatar file when the user has an avatar", async () => {
      const user = {
        ...mockUser,
        avatar: "avatars/user-123.png",
        resumes: [],
      };

      vi.mocked(deleteUser).mockResolvedValue(user as never);
      vi.mocked(storageService.delete).mockResolvedValue(undefined);

      await deleteUserService(userId);

      expect(storageService.delete).toHaveBeenCalledTimes(1);

      expect(storageService.delete).toHaveBeenCalledWith(
        "avatars/user-123.png",
      );
    });

    it("cleans up both resume files and avatar", async () => {
      const user = {
        ...mockUser,
        avatar: "avatars/user-123.png",
        resumes: [
          {
            id: "resume-1",
            filePath: "resumes/resume-1.pdf",
          },
          {
            id: "resume-2",
            filePath: "resumes/resume-2.pdf",
          },
        ],
      };

      vi.mocked(deleteUser).mockResolvedValue(user as never);
      vi.mocked(storageService.delete).mockResolvedValue(undefined);

      await deleteUserService(userId);

      expect(storageService.delete).toHaveBeenCalledTimes(3);

      expect(storageService.delete).toHaveBeenNthCalledWith(
        1,
        "resumes/resume-1.pdf",
      );

      expect(storageService.delete).toHaveBeenNthCalledWith(
        2,
        "resumes/resume-2.pdf",
      );

      expect(storageService.delete).toHaveBeenNthCalledWith(
        3,
        "avatars/user-123.png",
      );
    });

    it("continues deleting other files when a resume storage deletion fails", async () => {
      const user = {
        ...mockUser,
        resumes: [
          {
            id: "resume-1",
            filePath: "resumes/resume-1.pdf",
          },
          {
            id: "resume-2",
            filePath: "resumes/resume-2.pdf",
          },
        ],
      };

      vi.mocked(deleteUser).mockResolvedValue(user as never);

      vi.mocked(storageService.delete)
        .mockRejectedValueOnce(new Error("Storage unavailable"))
        .mockResolvedValueOnce(undefined);

      const consoleErrorSpy = vi
        .spyOn(console, "error")
        .mockImplementation(() => {});

      await expect(deleteUserService(userId)).resolves.toBe(user);

      expect(storageService.delete).toHaveBeenCalledTimes(2);

      expect(storageService.delete).toHaveBeenNthCalledWith(
        1,
        "resumes/resume-1.pdf",
      );

      expect(storageService.delete).toHaveBeenNthCalledWith(
        2,
        "resumes/resume-2.pdf",
      );

      expect(consoleErrorSpy).toHaveBeenCalled();

      consoleErrorSpy.mockRestore();
    });

    it("continues when avatar storage deletion fails", async () => {
      const user = {
        ...mockUser,
        avatar: "avatars/user-123.png",
        resumes: [],
      };

      vi.mocked(deleteUser).mockResolvedValue(user as never);

      vi.mocked(storageService.delete).mockRejectedValue(
        new Error("Storage unavailable"),
      );

      const consoleErrorSpy = vi
        .spyOn(console, "error")
        .mockImplementation(() => {});

      await expect(deleteUserService(userId)).resolves.toBe(user);

      expect(storageService.delete).toHaveBeenCalledWith(
        "avatars/user-123.png",
      );

      expect(consoleErrorSpy).toHaveBeenCalled();

      consoleErrorSpy.mockRestore();
    });

    it("does not access storage when the user has no files", async () => {
      const user = {
        ...mockUser,
        avatar: null,
        resumes: [],
      };

      vi.mocked(deleteUser).mockResolvedValue(user as never);

      const result = await deleteUserService(userId);

      expect(deleteUser).toHaveBeenCalledWith(userId);
      expect(storageService.delete).not.toHaveBeenCalled();
      expect(result).toBe(user);
    });
  });
});
