import { describe, expect, it, vi } from "vitest";

import { api } from "@/lib/api";

import { markNotificationRead } from "./mark-notification-read";

describe("markNotificationRead", () => {
  it("marks the specified notification as read", async () => {
    const patchSpy = vi.spyOn(api, "patch").mockResolvedValue({
      data: {},
    } as never);

    await markNotificationRead("notification-123");

    expect(patchSpy).toHaveBeenCalledWith(
      "/notifications/notification-123/read",
    );
  });
});
