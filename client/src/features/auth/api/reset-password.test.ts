import { beforeEach, describe, expect, it, vi } from "vitest";

import { api } from "@/lib/api";
import { resetPassword } from "./reset-password";

vi.mock("@/lib/api", () => ({
  api: {
    post: vi.fn(),
  },
}));

describe("resetPassword", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("sends the reset password data to the reset-password endpoint", async () => {
    const requestData = {
      token: "reset-token",
      newPassword: "newPassword123",
    };

    vi.mocked(api.post).mockResolvedValue({
      data: undefined,
    });

    const result = await resetPassword(requestData);

    expect(api.post).toHaveBeenCalledWith("/auth/reset-password", requestData);

    expect(result).toBeUndefined();
  });

  it("propagates API errors", async () => {
    const error = new Error("Invalid or expired reset token");

    vi.mocked(api.post).mockRejectedValue(error);

    await expect(
      resetPassword({
        token: "invalid-token",
        newPassword: "newPassword123",
      }),
    ).rejects.toThrow("Invalid or expired reset token");
  });
});
