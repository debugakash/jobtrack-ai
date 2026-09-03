import { describe, expect, it, vi } from "vitest";

import { api } from "@/lib/api";

import { markAllNotificationsRead } from "./mark-all-read";

describe("markAllNotificationsRead", () => {
  it("marks all notifications as read", async () => {
    const patchSpy = vi.spyOn(api, "patch").mockResolvedValue({
      data: {},
    } as never);

    await markAllNotificationsRead();

    expect(patchSpy).toHaveBeenCalledWith("/notifications/read-all");
  });
});
