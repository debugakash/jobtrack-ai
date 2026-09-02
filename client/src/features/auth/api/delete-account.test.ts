import { beforeEach, describe, expect, it, vi } from "vitest";

import { api } from "@/lib/api";
import { deleteAccount } from "./delete-account";

vi.mock("@/lib/api", () => ({
  api: {
    delete: vi.fn(),
  },
}));

describe("deleteAccount", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("sends a delete request to the account endpoint", async () => {
    const response = {
      success: true,
      message: "Account deleted successfully",
    };

    vi.mocked(api.delete).mockResolvedValue({
      data: response,
    });

    const result = await deleteAccount();

    expect(api.delete).toHaveBeenCalledWith("/auth/me");
    expect(result).toEqual(response);
  });

  it("propagates API errors", async () => {
    const error = new Error("Unable to delete account");

    vi.mocked(api.delete).mockRejectedValue(error);

    await expect(deleteAccount()).rejects.toThrow("Unable to delete account");
  });
});
