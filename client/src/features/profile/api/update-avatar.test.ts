import { describe, expect, it, vi } from "vitest";

import { api } from "@/lib/api";

import { updateAvatar } from "./update-avatar";

describe("updateAvatar", () => {
  it("uploads the avatar file to the correct endpoint", async () => {
    const patchSpy = vi.spyOn(api, "patch").mockResolvedValue({
      data: {
        data: {},
      },
    } as never);

    const file = new File(["avatar"], "avatar.png", {
      type: "image/png",
    });

    await updateAvatar(file);

    expect(patchSpy).toHaveBeenCalledTimes(1);

    const [url, formData] = patchSpy.mock.calls[0];

    expect(url).toBe("/auth/me/avatar");
    expect(formData).toBeInstanceOf(FormData);
    expect((formData as FormData).get("avatar")).toBe(file);
  });

  it("returns the updated avatar data from the API response", async () => {
    const avatarData = {
      avatarUrl: "https://example.com/avatar.png",
    };

    vi.spyOn(api, "patch").mockResolvedValue({
      data: {
        data: avatarData,
      },
    } as never);

    const file = new File(["avatar"], "avatar.png", {
      type: "image/png",
    });

    const result = await updateAvatar(file);

    expect(result).toEqual(avatarData);
  });
});
