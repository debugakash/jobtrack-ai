import { beforeEach, describe, expect, it, vi } from "vitest";

import { api } from "@/lib/api";
import { login } from "./login";

vi.mock("@/lib/api", () => ({
  api: {
    post: vi.fn(),
  },
}));

describe("login", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("sends login credentials to the login endpoint", async () => {
    const loginData = {
      email: "test@example.com",
      password: "password123",
    };

    const response = {
      success: true,
      message: "Login successful",
      data: {
        user: {
          id: "user-1",
          firstName: "Test",
          lastName: "User",
          email: "test@example.com",
          avatar: null,
          avatarUrl: null,
          emailNotifications: true,
          interviewReminders: true,
          followUpReminders: true,
        },
        accessToken: "test-token",
      },
    };

    vi.mocked(api.post).mockResolvedValue({
      data: response,
    });

    const result = await login(loginData);

    expect(api.post).toHaveBeenCalledWith("/auth/login", loginData);
    expect(result).toEqual(response);
  });

  it("propagates API errors", async () => {
    const error = new Error("Invalid credentials");

    vi.mocked(api.post).mockRejectedValue(error);

    await expect(
      login({
        email: "test@example.com",
        password: "wrong-password",
      }),
    ).rejects.toThrow("Invalid credentials");
  });
});
