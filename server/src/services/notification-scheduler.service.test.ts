import { beforeEach, describe, expect, it, vi } from "vitest";

import { getUsersForNotificationScheduler } from "../repositories/notifications.repository.js";

import { generateNotifications } from "./notifications.service.js";

import { runNotificationScheduler } from "./notification-scheduler.service.js";

vi.mock("../repositories/notifications.repository.js", () => ({
  getUsersForNotificationScheduler: vi.fn(),
}));

vi.mock("./notifications.service.js", () => ({
  generateNotifications: vi.fn(),
}));

describe("notification-scheduler.service", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    vi.mocked(getUsersForNotificationScheduler).mockResolvedValue([]);

    vi.mocked(generateNotifications).mockResolvedValue(undefined);
  });

  describe("runNotificationScheduler", () => {
    it("does nothing when there are no users", async () => {
      vi.mocked(getUsersForNotificationScheduler).mockResolvedValue([]);

      await runNotificationScheduler();

      expect(getUsersForNotificationScheduler).toHaveBeenCalledTimes(1);

      expect(generateNotifications).not.toHaveBeenCalled();
    });

    it("generates notifications for a user using their preferences", async () => {
      const users = [
        {
          id: "user-123",
          followUpReminders: true,
          interviewReminders: false,
        },
      ];

      vi.mocked(getUsersForNotificationScheduler).mockResolvedValue(
        users as never,
      );

      await runNotificationScheduler();

      expect(generateNotifications).toHaveBeenCalledTimes(1);

      expect(generateNotifications).toHaveBeenCalledWith("user-123", {
        followUpReminders: true,
        interviewReminders: false,
      });
    });

    it("generates notifications for every user", async () => {
      const users = [
        {
          id: "user-1",
          followUpReminders: true,
          interviewReminders: true,
        },
        {
          id: "user-2",
          followUpReminders: false,
          interviewReminders: true,
        },
        {
          id: "user-3",
          followUpReminders: true,
          interviewReminders: false,
        },
      ];

      vi.mocked(getUsersForNotificationScheduler).mockResolvedValue(
        users as never,
      );

      await runNotificationScheduler();

      expect(generateNotifications).toHaveBeenCalledTimes(3);

      expect(generateNotifications).toHaveBeenNthCalledWith(1, "user-1", {
        followUpReminders: true,
        interviewReminders: true,
      });

      expect(generateNotifications).toHaveBeenNthCalledWith(2, "user-2", {
        followUpReminders: false,
        interviewReminders: true,
      });

      expect(generateNotifications).toHaveBeenNthCalledWith(3, "user-3", {
        followUpReminders: true,
        interviewReminders: false,
      });
    });

    it("processes users sequentially", async () => {
      const users = [
        {
          id: "user-1",
          followUpReminders: true,
          interviewReminders: true,
        },
        {
          id: "user-2",
          followUpReminders: true,
          interviewReminders: true,
        },
      ];

      const processedUsers: string[] = [];

      vi.mocked(getUsersForNotificationScheduler).mockResolvedValue(
        users as never,
      );

      vi.mocked(generateNotifications).mockImplementation(async (userId) => {
        processedUsers.push(userId);
      });

      await runNotificationScheduler();

      expect(processedUsers).toEqual(["user-1", "user-2"]);
    });

    it("logs the number of processed users", async () => {
      const users = [
        {
          id: "user-1",
          followUpReminders: true,
          interviewReminders: true,
        },
        {
          id: "user-2",
          followUpReminders: false,
          interviewReminders: false,
        },
      ];

      vi.mocked(getUsersForNotificationScheduler).mockResolvedValue(
        users as never,
      );

      const consoleLogSpy = vi
        .spyOn(console, "log")
        .mockImplementation(() => {});

      await runNotificationScheduler();

      expect(consoleLogSpy).toHaveBeenCalledWith(
        "[Scheduler] Processed notifications for 2 user(s).",
      );

      consoleLogSpy.mockRestore();
    });

    it("propagates an error when fetching scheduler users fails", async () => {
      const error = new Error("Database connection failed");

      vi.mocked(getUsersForNotificationScheduler).mockRejectedValue(error);

      await expect(runNotificationScheduler()).rejects.toThrow(
        "Database connection failed",
      );

      expect(generateNotifications).not.toHaveBeenCalled();
    });

    it("stops processing when generating notifications fails", async () => {
      const users = [
        {
          id: "user-1",
          followUpReminders: true,
          interviewReminders: true,
        },
        {
          id: "user-2",
          followUpReminders: true,
          interviewReminders: true,
        },
      ];

      const error = new Error("Notification generation failed");

      vi.mocked(getUsersForNotificationScheduler).mockResolvedValue(
        users as never,
      );

      vi.mocked(generateNotifications)
        .mockRejectedValueOnce(error)
        .mockResolvedValueOnce(undefined);

      await expect(runNotificationScheduler()).rejects.toThrow(
        "Notification generation failed",
      );

      expect(generateNotifications).toHaveBeenCalledTimes(1);

      expect(generateNotifications).toHaveBeenCalledWith("user-1", {
        followUpReminders: true,
        interviewReminders: true,
      });
    });
  });
});
