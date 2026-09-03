import { describe, expect, it, vi } from "vitest";

import { api } from "@/lib/api";

import { updateNotificationPreferences } from "./update-notification-preferences";

describe("updateNotificationPreferences", () => {
  it("updates notification preferences with the provided data", async () => {
    const patchSpy = vi.spyOn(api, "patch").mockResolvedValue({
      data: {
        data: {},
      },
    } as never);

    const preferences = {
      emailNotifications: true,
      interviewReminders: false,
      followUpReminders: true,
    };

    await updateNotificationPreferences(preferences);

    expect(patchSpy).toHaveBeenCalledWith("/users/me/preferences", preferences);
  });

  it("returns the updated notification preferences", async () => {
    const preferences = {
      emailNotifications: true,
      interviewReminders: false,
      followUpReminders: true,
    };

    vi.spyOn(api, "patch").mockResolvedValue({
      data: {
        data: preferences,
      },
    } as never);

    const result = await updateNotificationPreferences(preferences);

    expect(result).toEqual(preferences);
  });
});
