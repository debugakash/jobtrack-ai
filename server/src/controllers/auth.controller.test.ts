import { beforeEach, describe, expect, it, vi } from "vitest";
import type { Request, Response } from "express";

import {
  loginUser,
  getCurrentUser,
  registerUser,
  changePassword,
  requestPasswordReset,
  resetPassword,
  updateUserAvatarService,
} from "../services/auth.service.js";

import {
  changePasswordSchema,
  forgotPasswordSchema,
  loginSchema,
  registerSchema,
  resetPasswordSchema,
} from "../validators/auth.validator.js";

import { storageService } from "../services/storage/index.js";

import {
  register,
  login,
  me,
  updateAvatar,
  changePasswordController,
  deleteAccount,
  forgotPassword,
  resetPasswordController,
} from "./auth.controller.js";

vi.mock("../services/auth.service.js", () => ({
  loginUser: vi.fn(),
  getCurrentUser: vi.fn(),
  registerUser: vi.fn(),
  changePassword: vi.fn(),
  requestPasswordReset: vi.fn(),
  resetPassword: vi.fn(),
  updateUserAvatarService: vi.fn(),
}));

vi.mock("../services/storage/index.js", () => ({
  storageService: {
    upload: vi.fn(),
    delete: vi.fn(),
    getSignedUrl: vi.fn(),
  },
}));

vi.mock("../services/user.service.js", () => ({
  deleteUserService: vi.fn(),
}));

function createMockResponse() {
  const json = vi.fn();
  const status = vi.fn(() => ({
    json,
  }));

  return {
    status,
    json,
  };
}

function createMockRequest(overrides: Partial<Request> = {}) {
  return {
    body: {},
    file: undefined,
    user: undefined,
    headers: {},
    ...overrides,
  } as Request;
}

describe("auth.controller", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("login", () => {
    it("returns the user and access token when login succeeds", async () => {
      const user = {
        id: "user-123",
        firstName: "John",
        lastName: "Doe",
        email: "john@example.com",
        passwordHash: "hashed-password",
        avatar: "avatars/avatar.png",
        phone: null,
        location: null,
        headline: null,
        bio: null,
        linkedinUrl: null,
        githubUrl: null,
        portfolioUrl: null,
        skills: null,
        emailVerified: false,
        isActive: true,
        createdAt: new Date(),
        emailNotifications: true,
        interviewReminders: true,
        followUpReminders: true,
      };

      vi.mocked(loginUser).mockResolvedValue({
        user,
        accessToken: "access-token",
      } as never);

      vi.mocked(storageService.getSignedUrl).mockResolvedValue(
        "https://storage.example.com/avatar",
      );

      const request = createMockRequest({
        body: {
          email: "john@example.com",
          password: "password123",
        },
      });

      const response = createMockResponse();

      const handler = login as any;

      await handler(request, response);

      expect(loginUser).toHaveBeenCalledWith({
        email: "john@example.com",
        password: "password123",
      });

      expect(storageService.getSignedUrl).toHaveBeenCalledWith(
        "avatars/avatar.png",
      );

      expect(response.status).toHaveBeenCalledWith(200);
      expect(response.status().json).toHaveBeenCalledWith({
        success: true,
        message: "Login successful",
        data: {
          user: {
            id: "user-123",
            firstName: "John",
            lastName: "Doe",
            email: "john@example.com",
            avatar: "avatars/avatar.png",
            avatarUrl: "https://storage.example.com/avatar",

            phone: null,
            location: null,
            headline: null,
            bio: null,
            linkedinUrl: null,
            githubUrl: null,
            portfolioUrl: null,
            skills: null,

            emailVerified: false,
            isActive: true,
            createdAt: user.createdAt,

            emailNotifications: true,
            interviewReminders: true,
            followUpReminders: true,
          },
          accessToken: "access-token",
        },
      });
    });

    it("still logs in when Supabase Storage is unavailable", async () => {
      const user = {
        id: "user-123",
        firstName: "John",
        lastName: "Doe",
        email: "john@example.com",
        passwordHash: "hashed-password",
        avatar: "avatars/avatar.png",
        phone: null,
        location: null,
        headline: null,
        bio: null,
        linkedinUrl: null,
        githubUrl: null,
        portfolioUrl: null,
        skills: null,
        emailVerified: false,
        isActive: true,
        createdAt: new Date(),
        emailNotifications: true,
        interviewReminders: true,
        followUpReminders: true,
      };

      vi.mocked(loginUser).mockResolvedValue({
        user,
        accessToken: "access-token",
      } as never);

      vi.mocked(storageService.getSignedUrl).mockRejectedValue(
        new Error("Storage unavailable"),
      );

      const consoleErrorSpy = vi
        .spyOn(console, "error")
        .mockImplementation(() => {});

      const request = createMockRequest({
        body: {
          email: "john@example.com",
          password: "password123",
        },
      });

      const response = createMockResponse();

      const handler = login as any;

      await handler(request, response);

      expect(loginUser).toHaveBeenCalledWith({
        email: "john@example.com",
        password: "password123",
      });

      expect(storageService.getSignedUrl).toHaveBeenCalledWith(
        "avatars/avatar.png",
      );

      expect(response.status).toHaveBeenCalledWith(200);

      const responseBody = response.status().json.mock.calls[0][0];

      expect(responseBody.success).toBe(true);
      expect(responseBody.message).toBe("Login successful");
      expect(responseBody.data.accessToken).toBe("access-token");
      expect(responseBody.data.user.id).toBe("user-123");
      expect(responseBody.data.user.avatar).toBe("avatars/avatar.png");
      expect(responseBody.data.user.avatarUrl).toBeNull();

      expect(consoleErrorSpy).toHaveBeenCalled();

      consoleErrorSpy.mockRestore();
    });

    it("does not access Storage when the user has no avatar", async () => {
      const user = {
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
        emailVerified: false,
        isActive: true,
        createdAt: new Date(),
        emailNotifications: true,
        interviewReminders: true,
        followUpReminders: true,
      };

      vi.mocked(loginUser).mockResolvedValue({
        user,
        accessToken: "access-token",
      } as never);

      const request = createMockRequest({
        body: {
          email: "john@example.com",
          password: "password123",
        },
      });

      const response = createMockResponse();

      const handler = login as any;

      await handler(request, response);

      expect(storageService.getSignedUrl).not.toHaveBeenCalled();

      expect(response.status).toHaveBeenCalledWith(200);

      const responseBody = response.status().json.mock.calls[0][0];

      expect(responseBody.data.user.avatarUrl).toBeNull();
    });
  });

  describe("me", () => {
    it("returns the current user with a signed avatar URL", async () => {
      const user = {
        id: "user-123",
        firstName: "John",
        lastName: "Doe",
        email: "john@example.com",
        passwordHash: "hashed-password",
        avatar: "avatars/avatar.png",
        phone: null,
        location: null,
        headline: null,
        bio: null,
        linkedinUrl: null,
        githubUrl: null,
        portfolioUrl: null,
        skills: null,
        emailVerified: false,
        isActive: true,
        createdAt: new Date(),
        emailNotifications: true,
        interviewReminders: true,
        followUpReminders: true,
      };

      vi.mocked(getCurrentUser).mockResolvedValue(user as never);

      vi.mocked(storageService.getSignedUrl).mockResolvedValue(
        "https://storage.example.com/avatar",
      );

      const request = createMockRequest({
        user: {
          userId: "user-123",
          email: "john@example.com",
        },
      });

      const response = createMockResponse();

      const handler = me as any;

      await handler(request, response);

      expect(getCurrentUser).toHaveBeenCalledWith("user-123");

      expect(storageService.getSignedUrl).toHaveBeenCalledWith(
        "avatars/avatar.png",
      );

      expect(response.status).toHaveBeenCalledWith(200);

      const responseBody = response.status().json.mock.calls[0][0];

      expect(responseBody.success).toBe(true);
      expect(responseBody.data.id).toBe("user-123");
      expect(responseBody.data.avatar).toBe("avatars/avatar.png");
      expect(responseBody.data.avatarUrl).toBe(
        "https://storage.example.com/avatar",
      );
    });

    it("still returns the current user when Supabase Storage is unavailable", async () => {
      const user = {
        id: "user-123",
        firstName: "John",
        lastName: "Doe",
        email: "john@example.com",
        passwordHash: "hashed-password",
        avatar: "avatars/avatar.png",
        phone: null,
        location: null,
        headline: null,
        bio: null,
        linkedinUrl: null,
        githubUrl: null,
        portfolioUrl: null,
        skills: null,
        emailVerified: false,
        isActive: true,
        createdAt: new Date(),
        emailNotifications: true,
        interviewReminders: true,
        followUpReminders: true,
      };

      vi.mocked(getCurrentUser).mockResolvedValue(user as never);

      vi.mocked(storageService.getSignedUrl).mockRejectedValue(
        new Error("Storage unavailable"),
      );

      const consoleErrorSpy = vi
        .spyOn(console, "error")
        .mockImplementation(() => {});

      const request = createMockRequest({
        user: {
          userId: "user-123",
          email: "john@example.com",
        },
      });

      const response = createMockResponse();

      const handler = me as any;

      await handler(request, response);

      expect(getCurrentUser).toHaveBeenCalledWith("user-123");

      expect(response.status).toHaveBeenCalledWith(200);

      const responseBody = response.status().json.mock.calls[0][0];

      expect(responseBody.success).toBe(true);
      expect(responseBody.data.id).toBe("user-123");
      expect(responseBody.data.avatar).toBe("avatars/avatar.png");
      expect(responseBody.data.avatarUrl).toBeNull();

      expect(consoleErrorSpy).toHaveBeenCalled();

      consoleErrorSpy.mockRestore();
    });

    it("does not access Storage when the user has no avatar", async () => {
      const user = {
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
        emailVerified: false,
        isActive: true,
        createdAt: new Date(),
        emailNotifications: true,
        interviewReminders: true,
        followUpReminders: true,
      };

      vi.mocked(getCurrentUser).mockResolvedValue(user as never);

      const request = createMockRequest({
        user: {
          userId: "user-123",
          email: "john@example.com",
        },
      });

      const response = createMockResponse();

      const handler = me as any;

      await handler(request, response);

      expect(storageService.getSignedUrl).not.toHaveBeenCalled();

      const responseBody = response.status().json.mock.calls[0][0];

      expect(responseBody.data.avatarUrl).toBeNull();
    });
  });
});
