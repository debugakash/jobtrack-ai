import { beforeEach, describe, expect, it, vi } from "vitest";

import { api } from "@/lib/api";
import { forgotPassword } from "./forgot-password";

vi.mock("@/lib/api", () => ({
  api: {
    post: vi.fn(),
  },
}));

describe("forgotPassword", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("sends the email to the forgot-password endpoint", async () => {
    const requestData = {
      email: "test@example.com",
    };

    vi.mocked(api.post).mockResolvedValue({
      data: undefined,
    });

    const result = await forgotPassword(requestData);

    expect(api.post).toHaveBeenCalledWith("/auth/forgot-password", requestData);

    expect(result).toBeUndefined();
  });

  it("propagates API errors", async () => {
    const error = new Error("Unable to send reset email");

    vi.mocked(api.post).mockRejectedValue(error);

    await expect(
      forgotPassword({
        email: "test@example.com",
      }),
    ).rejects.toThrow("Unable to send reset email");
  });
});
