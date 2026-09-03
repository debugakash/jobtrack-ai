import { describe, expect, it, vi } from "vitest";

import { api } from "@/lib/api";

import { changePassword } from "./change-password";

describe("changePassword", () => {
  it("changes the password with the provided credentials", async () => {
    const patchSpy = vi.spyOn(api, "patch").mockResolvedValue({
      data: {},
    } as never);

    const passwordData = {
      currentPassword: "old-password",
      newPassword: "new-password",
    };

    await changePassword(passwordData);

    expect(patchSpy).toHaveBeenCalledWith("/auth/me/password", passwordData);
  });

  it("returns the API response", async () => {
    const responseData = {
      success: true,
      message: "Password changed successfully",
    };

    vi.spyOn(api, "patch").mockResolvedValue({
      data: responseData,
    } as never);

    const result = await changePassword({
      currentPassword: "old-password",
      newPassword: "new-password",
    });

    expect(result).toEqual(responseData);
  });
});
