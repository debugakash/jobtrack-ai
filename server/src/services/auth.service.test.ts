import { beforeEach, describe, expect, it, vi } from "vitest";

import {
  createUser,
  findUserByEmail,
  findUserById,
  updateUserAvatar,
  updateUserPassword,
} from "../repositories/user.repository.js";

import {
  findPasswordResetToken,
  createPasswordResetToken,
  deletePasswordResetTokensForUser,
  markPasswordResetTokenAsUsed,
} from "../repositories/password-reset.repository.js";

import { hashPassword } from "../utils/hash.js";
import { generateAccessToken } from "../utils/jwt.js";
import {
  generatePasswordResetToken,
  hashPasswordResetToken,
} from "../utils/password-reset-token.js";
import { getPasswordResetTokenExpiry } from "../utils/password-reset-config.js";
import { sendPasswordResetEmail } from "./email.service.js";
import { storageService } from "./storage/index.js";

import {
  registerUser,
  loginUser,
  getCurrentUser,
  updateUserAvatarService,
  changePassword,
  requestPasswordReset,
  resetPassword,
  getUserAvatarUrlService,
} from "./auth.service.js";

vi.mock("../repositories/user.repository.js", () => ({
  createUser: vi.fn(),
  findUserByEmail: vi.fn(),
  findUserById: vi.fn(),
  updateUserAvatar: vi.fn(),
  updateUserPassword: vi.fn(),
}));

vi.mock("../repositories/password-reset.repository.js", () => ({
  findPasswordResetToken: vi.fn(),
  createPasswordResetToken: vi.fn(),
  deletePasswordResetTokensForUser: vi.fn(),
  markPasswordResetTokenAsUsed: vi.fn(),
}));

vi.mock("../utils/hash.js", () => ({
  hashPassword: vi.fn(),
}));

vi.mock("../utils/jwt.js", () => ({
  generateAccessToken: vi.fn(),
}));

vi.mock("../utils/password-reset-token.js", () => ({
  generatePasswordResetToken: vi.fn(),
  hashPasswordResetToken: vi.fn(),
}));

vi.mock("../utils/password-reset-config.js", () => ({
  getPasswordResetTokenExpiry: vi.fn(),
}));

vi.mock("./email.service.js", () => ({
  sendPasswordResetEmail: vi.fn(),
}));

vi.mock("./storage/index.js", () => ({
  storageService: {
    delete: vi.fn(),
    getSignedUrl: vi.fn(),
  },
}));

vi.mock("bcrypt", () => ({
  default: {
    compare: vi.fn(),
  },
}));

import bcrypt from "bcrypt";

const mockUser = {
  id: "user-123",
  firstName: "John",
  lastName: "Doe",
  email: "john@example.com",
  passwordHash: "hashed-password",
  avatar: null,
  phone: null,
  location: null,
  headline: null,
  bio: null,
  linkedinUrl: null,
  githubUrl: null,
  portfolioUrl: null,
  skills: null,
  isActive: true,
  emailVerified: false,
  lastLogin: null,
  emailNotifications: true,
  interviewReminders: true,
  followUpReminders: true,
  createdAt: new Date(),
  updatedAt: new Date(),
};

describe("auth.service", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("registerUser", () => {
    it("creates a new user with a hashed password", async () => {
      vi.mocked(findUserByEmail).mockResolvedValue(null);
      vi.mocked(hashPassword).mockResolvedValue("hashed-password" as never);

      const user = {
        id: "user-123",
        firstName: "John",
        lastName: "Doe",
        email: "john@example.com",
      };

      vi.mocked(createUser).mockResolvedValue(user as never);

      const result = await registerUser({
        firstName: "John",
        lastName: "Doe",
        email: "john@example.com",
        password: "password123",
      });

      expect(findUserByEmail).toHaveBeenCalledWith("john@example.com");
      expect(hashPassword).toHaveBeenCalledWith("password123");
      expect(createUser).toHaveBeenCalledWith({
        firstName: "John",
        lastName: "Doe",
        email: "john@example.com",
        passwordHash: "hashed-password",
      });
      expect(result).toEqual(user);
    });

    it("throws ConflictError when the email already exists", async () => {
      vi.mocked(findUserByEmail).mockResolvedValue({
        id: "existing-user",
        email: "john@example.com",
      } as never);

      await expect(
        registerUser({
          firstName: "John",
          lastName: "Doe",
          email: "john@example.com",
          password: "password123",
        }),
      ).rejects.toThrow("User with this email already exists");

      expect(hashPassword).not.toHaveBeenCalled();
      expect(createUser).not.toHaveBeenCalled();
    });
  });

  describe("loginUser", () => {
    it("returns the user and access token for valid credentials", async () => {
      const user = {
        id: "user-123",
        email: "john@example.com",
        passwordHash: "hashed-password",
      };

      vi.mocked(findUserByEmail).mockResolvedValue(user as never);
      vi.mocked(bcrypt.compare).mockResolvedValue(true as never);
      vi.mocked(generateAccessToken).mockReturnValue("access-token");

      const result = await loginUser({
        email: "john@example.com",
        password: "password123",
      });

      expect(findUserByEmail).toHaveBeenCalledWith("john@example.com");
      expect(bcrypt.compare).toHaveBeenCalledWith(
        "password123",
        "hashed-password",
      );
      expect(generateAccessToken).toHaveBeenCalledWith({
        userId: "user-123",
        email: "john@example.com",
      });

      expect(result).toEqual({
        user,
        accessToken: "access-token",
      });
    });

    it("throws UnauthorizedError when the user does not exist", async () => {
      vi.mocked(findUserByEmail).mockResolvedValue(null);

      await expect(
        loginUser({
          email: "unknown@example.com",
          password: "password123",
        }),
      ).rejects.toThrow("Invalid email or password");

      expect(bcrypt.compare).not.toHaveBeenCalled();
      expect(generateAccessToken).not.toHaveBeenCalled();
    });

    it("throws UnauthorizedError when the password is incorrect", async () => {
      vi.mocked(findUserByEmail).mockResolvedValue({
        id: "user-123",
        email: "john@example.com",
        passwordHash: "hashed-password",
      } as never);

      vi.mocked(bcrypt.compare).mockResolvedValue(false as never);

      await expect(
        loginUser({
          email: "john@example.com",
          password: "wrong-password",
        }),
      ).rejects.toThrow("Invalid email or password");

      expect(generateAccessToken).not.toHaveBeenCalled();
    });
  });

  describe("getCurrentUser", () => {
    it("returns the user when found", async () => {
      const user = {
        id: "user-123",
        email: "john@example.com",
      };

      vi.mocked(findUserById).mockResolvedValue(user as never);

      const result = await getCurrentUser("user-123");

      expect(findUserById).toHaveBeenCalledWith("user-123");
      expect(result).toEqual(user);
    });

    it("throws NotFoundError when the user does not exist", async () => {
      vi.mocked(findUserById).mockResolvedValue(null);

      await expect(getCurrentUser("missing-user")).rejects.toThrow(
        "User not found",
      );
    });
  });

  describe("updateUserAvatarService", () => {
    it("updates the avatar without deleting when there is no previous avatar", async () => {
      const user = {
        id: "user-123",
        avatar: null,
      };

      const updatedUser = {
        ...user,
        avatar: "avatars/new-avatar.png",
      };

      vi.mocked(findUserById).mockResolvedValue(user as never);
      vi.mocked(updateUserAvatar).mockResolvedValue(updatedUser as never);

      const result = await updateUserAvatarService(
        "user-123",
        "avatars/new-avatar.png",
      );

      expect(updateUserAvatar).toHaveBeenCalledWith(
        "user-123",
        "avatars/new-avatar.png",
      );
      expect(storageService.delete).not.toHaveBeenCalled();
      expect(result).toEqual(updatedUser);
    });

    it("deletes the previous avatar when it is different from the new avatar", async () => {
      const user = {
        id: "user-123",
        avatar: "avatars/old-avatar.png",
      };

      const updatedUser = {
        ...user,
        avatar: "avatars/new-avatar.png",
      };

      vi.mocked(findUserById).mockResolvedValue(user as never);
      vi.mocked(updateUserAvatar).mockResolvedValue(updatedUser as never);
      vi.mocked(storageService.delete).mockResolvedValue(undefined);

      const result = await updateUserAvatarService(
        "user-123",
        "avatars/new-avatar.png",
      );

      expect(storageService.delete).toHaveBeenCalledWith(
        "avatars/old-avatar.png",
      );
      expect(result).toEqual(updatedUser);
    });

    it("does not delete the previous avatar when the path is unchanged", async () => {
      const user = {
        id: "user-123",
        avatar: "avatars/avatar.png",
      };

      vi.mocked(findUserById).mockResolvedValue(user as never);
      vi.mocked(updateUserAvatar).mockResolvedValue(user as never);

      await updateUserAvatarService("user-123", "avatars/avatar.png");

      expect(storageService.delete).not.toHaveBeenCalled();
    });

    it("continues successfully when deleting the previous avatar fails", async () => {
      const user = {
        id: "user-123",
        avatar: "avatars/old-avatar.png",
      };

      const updatedUser = {
        ...user,
        avatar: "avatars/new-avatar.png",
      };

      vi.mocked(findUserById).mockResolvedValue(user as never);
      vi.mocked(updateUserAvatar).mockResolvedValue(updatedUser as never);
      vi.mocked(storageService.delete).mockRejectedValue(
        new Error("Storage unavailable"),
      );

      const consoleErrorSpy = vi
        .spyOn(console, "error")
        .mockImplementation(() => {});

      const result = await updateUserAvatarService(
        "user-123",
        "avatars/new-avatar.png",
      );

      expect(result).toEqual(updatedUser);
      expect(consoleErrorSpy).toHaveBeenCalled();

      consoleErrorSpy.mockRestore();
    });

    it("throws NotFoundError when the user does not exist", async () => {
      vi.mocked(findUserById).mockResolvedValue(null);

      await expect(
        updateUserAvatarService("missing-user", "avatars/avatar.png"),
      ).rejects.toThrow("User not found");

      expect(updateUserAvatar).not.toHaveBeenCalled();
    });
  });

  describe("changePassword", () => {
    it("changes the password when the current password is valid", async () => {
      vi.mocked(findUserById).mockResolvedValue({
        id: "user-123",
        passwordHash: "old-hash",
      } as never);

      vi.mocked(bcrypt.compare).mockResolvedValue(true as never);
      vi.mocked(hashPassword).mockResolvedValue("new-hash" as never);
      vi.mocked(updateUserPassword).mockResolvedValue(mockUser);

      await changePassword("user-123", "old-password", "new-password");

      expect(bcrypt.compare).toHaveBeenCalledWith("old-password", "old-hash");
      expect(hashPassword).toHaveBeenCalledWith("new-password");
      expect(updateUserPassword).toHaveBeenCalledWith("user-123", "new-hash");
    });

    it("throws NotFoundError when the user does not exist", async () => {
      vi.mocked(findUserById).mockResolvedValue(null);

      await expect(
        changePassword("missing-user", "old-password", "new-password"),
      ).rejects.toThrow("User not found");

      expect(bcrypt.compare).not.toHaveBeenCalled();
    });

    it("throws UnauthorizedError when the current password is incorrect", async () => {
      vi.mocked(findUserById).mockResolvedValue({
        id: "user-123",
        passwordHash: "old-hash",
      } as never);

      vi.mocked(bcrypt.compare).mockResolvedValue(false as never);

      await expect(
        changePassword("user-123", "wrong-password", "new-password"),
      ).rejects.toThrow("Current password is incorrect");

      expect(hashPassword).not.toHaveBeenCalled();
      expect(updateUserPassword).not.toHaveBeenCalled();
    });
  });

  describe("requestPasswordReset", () => {
    it("does nothing when the email does not belong to a user", async () => {
      vi.mocked(findUserByEmail).mockResolvedValue(null);

      await requestPasswordReset("unknown@example.com");

      expect(deletePasswordResetTokensForUser).not.toHaveBeenCalled();
      expect(generatePasswordResetToken).not.toHaveBeenCalled();
      expect(sendPasswordResetEmail).not.toHaveBeenCalled();
    });

    it("creates a reset token and sends the reset email", async () => {
      const user = {
        id: "user-123",
        email: "john@example.com",
      };

      const expiresAt = new Date("2026-09-10T12:00:00.000Z");

      vi.mocked(findUserByEmail).mockResolvedValue(user as never);
      vi.mocked(deletePasswordResetTokensForUser).mockResolvedValue({
        count: 1,
      });
      vi.mocked(generatePasswordResetToken).mockReturnValue("raw-token");
      vi.mocked(hashPasswordResetToken).mockReturnValue("hashed-token");
      vi.mocked(getPasswordResetTokenExpiry).mockReturnValue(expiresAt);
      vi.mocked(createPasswordResetToken).mockResolvedValue({
        id: "reset-token-123",
        userId: "user-123",
        tokenHash: "hashed-token",
        expiresAt: new Date(),
        usedAt: null,
        createdAt: new Date(),
      });
      vi.mocked(sendPasswordResetEmail).mockResolvedValue({
        id: "test-email-id",
      } as never);

      process.env.CLIENT_URL = "http://localhost:5173";

      await requestPasswordReset("john@example.com");

      expect(deletePasswordResetTokensForUser).toHaveBeenCalledWith("user-123");

      expect(hashPasswordResetToken).toHaveBeenCalledWith("raw-token");

      expect(createPasswordResetToken).toHaveBeenCalledWith({
        tokenHash: "hashed-token",
        userId: "user-123",
        expiresAt,
      });

      expect(sendPasswordResetEmail).toHaveBeenCalledWith({
        to: "john@example.com",
        resetUrl: "http://localhost:5173/reset-password?token=raw-token",
      });
    });

    it("throws when CLIENT_URL is not configured", async () => {
      vi.mocked(findUserByEmail).mockResolvedValue({
        id: "user-123",
        email: "john@example.com",
      } as never);

      vi.mocked(deletePasswordResetTokensForUser).mockResolvedValue({
        count: 1,
      });
      vi.mocked(generatePasswordResetToken).mockReturnValue("raw-token");
      vi.mocked(hashPasswordResetToken).mockReturnValue("hashed-token");
      vi.mocked(getPasswordResetTokenExpiry).mockReturnValue(new Date());
      vi.mocked(createPasswordResetToken).mockResolvedValue({
        id: "reset-token-123",
        userId: "user-123",
        tokenHash: "hashed-token",
        expiresAt: new Date(),
        usedAt: null,
        createdAt: new Date(),
      });

      delete process.env.CLIENT_URL;

      await expect(requestPasswordReset("john@example.com")).rejects.toThrow(
        "CLIENT_URL is not configured.",
      );

      expect(sendPasswordResetEmail).not.toHaveBeenCalled();
    });
  });

  describe("resetPassword", () => {
    it("resets the password and marks the token as used", async () => {
      const expiresAt = new Date(Date.now() + 60_000);

      vi.mocked(hashPasswordResetToken).mockReturnValue("hashed-token");

      vi.mocked(findPasswordResetToken).mockResolvedValue({
        id: "reset-token-123",
        userId: "user-123",
        usedAt: null,
        expiresAt,
      } as never);

      vi.mocked(hashPassword).mockResolvedValue("new-password-hash" as never);
      vi.mocked(updateUserPassword).mockResolvedValue(mockUser);
      vi.mocked(markPasswordResetTokenAsUsed).mockResolvedValue({
        id: "reset-token-123",
        userId: "user-123",
        tokenHash: "hashed-token",
        expiresAt: new Date(),
        usedAt: new Date(),
        createdAt: new Date(),
      });

      await resetPassword("raw-token", "new-password");

      expect(hashPasswordResetToken).toHaveBeenCalledWith("raw-token");
      expect(findPasswordResetToken).toHaveBeenCalledWith("hashed-token");
      expect(hashPassword).toHaveBeenCalledWith("new-password");
      expect(updateUserPassword).toHaveBeenCalledWith(
        "user-123",
        "new-password-hash",
      );
      expect(markPasswordResetTokenAsUsed).toHaveBeenCalledWith(
        "reset-token-123",
      );
    });

    it("throws when the reset token does not exist", async () => {
      vi.mocked(hashPasswordResetToken).mockReturnValue("hashed-token");
      vi.mocked(findPasswordResetToken).mockResolvedValue(null);

      await expect(
        resetPassword("invalid-token", "new-password"),
      ).rejects.toThrow("Invalid or expired password reset token");

      expect(updateUserPassword).not.toHaveBeenCalled();
    });

    it("throws when the reset token has already been used", async () => {
      vi.mocked(hashPasswordResetToken).mockReturnValue("hashed-token");

      vi.mocked(findPasswordResetToken).mockResolvedValue({
        id: "reset-token-123",
        userId: "user-123",
        usedAt: new Date(),
        expiresAt: new Date(Date.now() + 60_000),
      } as never);

      await expect(resetPassword("used-token", "new-password")).rejects.toThrow(
        "Invalid or expired password reset token",
      );

      expect(updateUserPassword).not.toHaveBeenCalled();
    });

    it("throws when the reset token has expired", async () => {
      vi.mocked(hashPasswordResetToken).mockReturnValue("hashed-token");

      vi.mocked(findPasswordResetToken).mockResolvedValue({
        id: "reset-token-123",
        userId: "user-123",
        usedAt: null,
        expiresAt: new Date(Date.now() - 60_000),
      } as never);

      await expect(
        resetPassword("expired-token", "new-password"),
      ).rejects.toThrow("Invalid or expired password reset token");

      expect(updateUserPassword).not.toHaveBeenCalled();
    });
  });

  describe("getUserAvatarUrlService", () => {
    it("returns null when the user has no avatar", async () => {
      vi.mocked(findUserById).mockResolvedValue({
        id: "user-123",
        avatar: null,
      } as never);

      const result = await getUserAvatarUrlService("user-123");

      expect(result).toBeNull();
      expect(storageService.getSignedUrl).not.toHaveBeenCalled();
    });

    it("returns a signed URL when the user has an avatar", async () => {
      vi.mocked(findUserById).mockResolvedValue({
        id: "user-123",
        avatar: "avatars/avatar.png",
      } as never);

      vi.mocked(storageService.getSignedUrl).mockResolvedValue(
        "https://storage.example.com/signed-avatar-url",
      );

      const result = await getUserAvatarUrlService("user-123");

      expect(storageService.getSignedUrl).toHaveBeenCalledWith(
        "avatars/avatar.png",
      );
      expect(result).toBe("https://storage.example.com/signed-avatar-url");
    });

    it("throws NotFoundError when the user does not exist", async () => {
      vi.mocked(findUserById).mockResolvedValue(null);

      await expect(getUserAvatarUrlService("missing-user")).rejects.toThrow(
        "User not found",
      );

      expect(storageService.getSignedUrl).not.toHaveBeenCalled();
    });
  });
});
