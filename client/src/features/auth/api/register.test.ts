import { beforeEach, describe, expect, it, vi } from "vitest";

import { api } from "@/lib/api";
import { register } from "./register";

vi.mock("@/lib/api", () => ({
  api: {
    post: vi.fn(),
  },
}));

describe("register", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("sends registration data to the register endpoint", async () => {
    const registerData = {
      firstName: "Test",
      lastName: "User",
      email: "test@example.com",
      password: "password123",
    };

    const response = {
      success: true,
      message: "Registration successful",
      data: {
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
    };

    vi.mocked(api.post).mockResolvedValue({
      data: response,
    });

    const result = await register(registerData);

    expect(api.post).toHaveBeenCalledWith("/auth/register", registerData);

    expect(result).toEqual(response);
  });

  it("propagates API errors", async () => {
    const error = new Error("Email already exists");

    vi.mocked(api.post).mockRejectedValue(error);

    await expect(
      register({
        firstName: "Test",
        lastName: "User",
        email: "existing@example.com",
        password: "password123",
      }),
    ).rejects.toThrow("Email already exists");
  });
});
