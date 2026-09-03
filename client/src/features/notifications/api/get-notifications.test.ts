import { describe, expect, it, vi } from "vitest";

import { api } from "@/lib/api";

import { getNotifications } from "./get-notifications";

describe("getNotifications", () => {
  it("calls the notifications endpoint", async () => {
    const getSpy = vi.spyOn(api, "get").mockResolvedValue({
      data: {
        data: {},
      },
    } as never);

    await getNotifications();

    expect(getSpy).toHaveBeenCalledWith("/notifications");
  });

  it("returns the notifications data from the API response", async () => {
    const notifications = {
      notifications: [],
      unreadCount: 0,
    };

    vi.spyOn(api, "get").mockResolvedValue({
      data: {
        data: notifications,
      },
    } as never);

    const result = await getNotifications();

    expect(result).toEqual(notifications);
  });
});
