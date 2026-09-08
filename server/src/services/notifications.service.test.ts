import { beforeEach, describe, expect, it, vi } from "vitest";

import {
  createNotification,
  findNotification,
  getFollowUpReminders,
  getInterviewReminders,
  getNotifications,
  getUserNotificationSettings,
  markAllAsRead,
  markAsRead,
} from "../repositories/notifications.repository.js";

import { sendEmail } from "./email.service.js";

import {
  generateNotifications,
  getNotificationsService,
  markAllNotificationsReadService,
  markNotificationReadService,
} from "./notifications.service.js";

vi.mock("../repositories/notifications.repository.js", () => ({
  createNotification: vi.fn(),
  findNotification: vi.fn(),
  getFollowUpReminders: vi.fn(),
  getInterviewReminders: vi.fn(),
  getNotifications: vi.fn(),
  getUserNotificationSettings: vi.fn(),
  markAllAsRead: vi.fn(),
  markAsRead: vi.fn(),
}));

vi.mock("./email.service.js", () => ({
  sendEmail: vi.fn(),
}));

describe("notifications.service", () => {
  const userId = "user-123";
  const jobId = "job-123";

  beforeEach(() => {
    vi.clearAllMocks();

    vi.mocked(getUserNotificationSettings).mockResolvedValue(null);

    vi.mocked(getInterviewReminders).mockResolvedValue([]);

    vi.mocked(getFollowUpReminders).mockResolvedValue([]);

    vi.mocked(findNotification).mockResolvedValue(null);

    vi.mocked(createNotification).mockResolvedValue({
      id: "notification-123",
    } as never);

    vi.mocked(sendEmail).mockResolvedValue({
      id: "email-123",
    } as never);
  });

  // ---------------------------------------------------------------------------
  // getNotificationsService
  // ---------------------------------------------------------------------------

  describe("getNotificationsService", () => {
    it("returns notifications for the user", async () => {
      const notifications = [
        {
          id: "notification-1",
          userId,
          title: "Interview Today",
        },
        {
          id: "notification-2",
          userId,
          title: "Follow-up Today",
        },
      ];

      vi.mocked(getNotifications).mockResolvedValue(notifications as never);

      const result = await getNotificationsService(userId);

      expect(result).toEqual(notifications);

      expect(getNotifications).toHaveBeenCalledWith(userId);
    });
  });

  // ---------------------------------------------------------------------------
  // markNotificationReadService
  // ---------------------------------------------------------------------------

  describe("markNotificationReadService", () => {
    it("marks a notification as read", async () => {
      const notification = {
        id: "notification-123",
        userId,
        read: true,
      };

      vi.mocked(markAsRead).mockResolvedValue(notification as never);

      const result = await markNotificationReadService(
        "notification-123",
        userId,
      );

      expect(result).toEqual(notification);

      expect(markAsRead).toHaveBeenCalledWith("notification-123", userId);
    });
  });

  // ---------------------------------------------------------------------------
  // markAllNotificationsReadService
  // ---------------------------------------------------------------------------

  describe("markAllNotificationsReadService", () => {
    it("marks all notifications as read", async () => {
      const resultData = {
        count: 5,
      };

      vi.mocked(markAllAsRead).mockResolvedValue(resultData as never);

      const result = await markAllNotificationsReadService(userId);

      expect(result).toEqual(resultData);

      expect(markAllAsRead).toHaveBeenCalledWith(userId);
    });
  });

  // ---------------------------------------------------------------------------
  // generateNotifications - interview reminders
  // ---------------------------------------------------------------------------

  describe("generateNotifications - interview reminders", () => {
    it("creates an interview notification for an interview scheduled today", async () => {
      const today = new Date();

      const interview = {
        scheduledAt: today,
        job: {
          id: jobId,
          company: "Acme Corp",
        },
      };

      vi.mocked(getInterviewReminders).mockResolvedValue([interview] as never);

      await generateNotifications(userId);

      expect(findNotification).toHaveBeenCalledWith(
        userId,
        jobId,
        "INTERVIEW",
        expect.any(Date),
      );

      expect(createNotification).toHaveBeenCalledWith({
        userId,
        jobId,
        title: "Interview Today",
        message: "Acme Corp interview is scheduled today.",
        type: "INTERVIEW",
        actionUrl: `/jobs/${jobId}`,
        reminderDate: expect.any(Date),
      });
    });

    it("creates an interview notification for an interview scheduled tomorrow", async () => {
      const tomorrow = new Date();

      tomorrow.setDate(tomorrow.getDate() + 1);

      const interview = {
        scheduledAt: tomorrow,
        job: {
          id: jobId,
          company: "Acme Corp",
        },
      };

      vi.mocked(getInterviewReminders).mockResolvedValue([interview] as never);

      await generateNotifications(userId);

      expect(createNotification).toHaveBeenCalledWith({
        userId,
        jobId,
        title: "Interview Tomorrow",
        message: "Acme Corp interview is tomorrow.",
        type: "INTERVIEW",
        actionUrl: `/jobs/${jobId}`,
        reminderDate: expect.any(Date),
      });
    });

    it("does not create a notification for an interview more than one day away", async () => {
      const futureDate = new Date();

      futureDate.setDate(futureDate.getDate() + 3);

      const interview = {
        scheduledAt: futureDate,
        job: {
          id: jobId,
          company: "Acme Corp",
        },
      };

      vi.mocked(getInterviewReminders).mockResolvedValue([interview] as never);

      await generateNotifications(userId);

      expect(findNotification).not.toHaveBeenCalled();

      expect(createNotification).not.toHaveBeenCalled();

      expect(sendEmail).not.toHaveBeenCalled();
    });

    it("does not create a duplicate interview notification", async () => {
      const today = new Date();

      const interview = {
        scheduledAt: today,
        job: {
          id: jobId,
          company: "Acme Corp",
        },
      };

      vi.mocked(getInterviewReminders).mockResolvedValue([interview] as never);

      vi.mocked(findNotification).mockResolvedValue({
        id: "existing-notification",
      } as never);

      await generateNotifications(userId);

      expect(findNotification).toHaveBeenCalled();

      expect(createNotification).not.toHaveBeenCalled();

      expect(sendEmail).not.toHaveBeenCalled();
    });

    it("sends an email when interview email notifications are enabled", async () => {
      const today = new Date();

      const interview = {
        scheduledAt: today,
        job: {
          id: jobId,
          company: "Acme Corp",
        },
      };

      vi.mocked(getUserNotificationSettings).mockResolvedValue({
        emailNotifications: true,
        email: "user@example.com",
      } as never);

      vi.mocked(getInterviewReminders).mockResolvedValue([interview] as never);

      await generateNotifications(userId);

      expect(sendEmail).toHaveBeenCalledWith({
        to: "user@example.com",
        subject: "Interview Today",
        html: expect.stringContaining("Interview Today"),
      });
    });

    it("does not send an email when email notifications are disabled", async () => {
      const today = new Date();

      const interview = {
        scheduledAt: today,
        job: {
          id: jobId,
          company: "Acme Corp",
        },
      };

      vi.mocked(getUserNotificationSettings).mockResolvedValue({
        emailNotifications: false,
        email: "user@example.com",
      } as never);

      vi.mocked(getInterviewReminders).mockResolvedValue([interview] as never);

      await generateNotifications(userId);

      expect(createNotification).toHaveBeenCalled();

      expect(sendEmail).not.toHaveBeenCalled();
    });

    it("does not send an email when email address is missing", async () => {
      const today = new Date();

      const interview = {
        scheduledAt: today,
        job: {
          id: jobId,
          company: "Acme Corp",
        },
      };

      vi.mocked(getUserNotificationSettings).mockResolvedValue({
        emailNotifications: true,
        email: null,
      } as never);

      vi.mocked(getInterviewReminders).mockResolvedValue([interview] as never);

      await generateNotifications(userId);

      expect(createNotification).toHaveBeenCalled();

      expect(sendEmail).not.toHaveBeenCalled();
    });

    it("does not process interview reminders when disabled by preferences", async () => {
      await generateNotifications(userId, {
        followUpReminders: true,
        interviewReminders: false,
      });

      expect(getInterviewReminders).not.toHaveBeenCalled();

      expect(createNotification).not.toHaveBeenCalled();

      expect(sendEmail).not.toHaveBeenCalled();
    });
  });

  // ---------------------------------------------------------------------------
  // generateNotifications - follow-up reminders
  // ---------------------------------------------------------------------------

  describe("generateNotifications - follow-up reminders", () => {
    it("creates a notification for a follow-up scheduled today", async () => {
      const today = new Date();

      const job = {
        id: jobId,
        company: "Acme Corp",
        jobTitle: "Frontend Developer",
        followUpDate: today,
      };

      vi.mocked(getFollowUpReminders).mockResolvedValue([job] as never);

      await generateNotifications(userId);

      expect(findNotification).toHaveBeenCalledWith(
        userId,
        jobId,
        "FOLLOW_UP",
        expect.any(Date),
      );

      expect(createNotification).toHaveBeenCalledWith({
        userId,
        jobId,
        title: "Follow-up Today",
        message: "Today is the follow-up day for Acme Corp.",
        type: "FOLLOW_UP",
        actionUrl: `/jobs/${jobId}`,
        reminderDate: expect.any(Date),
      });
    });

    it("creates an overdue notification for a past follow-up date", async () => {
      const yesterday = new Date();

      yesterday.setDate(yesterday.getDate() - 1);

      const job = {
        id: jobId,
        company: "Acme Corp",
        jobTitle: "Frontend Developer",
        followUpDate: yesterday,
      };

      vi.mocked(getFollowUpReminders).mockResolvedValue([job] as never);

      await generateNotifications(userId);

      expect(createNotification).toHaveBeenCalledWith({
        userId,
        jobId,
        title: "Follow-up Overdue",
        message: "Follow up with Acme Corp for Frontend Developer.",
        type: "FOLLOW_UP",
        actionUrl: `/jobs/${jobId}`,
        reminderDate: expect.any(Date),
      });
    });

    it("does not create a notification for a future follow-up date", async () => {
      const futureDate = new Date();

      futureDate.setDate(futureDate.getDate() + 3);

      const job = {
        id: jobId,
        company: "Acme Corp",
        jobTitle: "Frontend Developer",
        followUpDate: futureDate,
      };

      vi.mocked(getFollowUpReminders).mockResolvedValue([job] as never);

      await generateNotifications(userId);

      expect(findNotification).not.toHaveBeenCalled();

      expect(createNotification).not.toHaveBeenCalled();

      expect(sendEmail).not.toHaveBeenCalled();
    });

    it("skips a follow-up reminder when followUpDate is missing", async () => {
      const job = {
        id: jobId,
        company: "Acme Corp",
        jobTitle: "Frontend Developer",
        followUpDate: null,
      };

      vi.mocked(getFollowUpReminders).mockResolvedValue([job] as never);

      await generateNotifications(userId);

      expect(findNotification).not.toHaveBeenCalled();

      expect(createNotification).not.toHaveBeenCalled();
    });

    it("does not create a duplicate follow-up notification", async () => {
      const today = new Date();

      const job = {
        id: jobId,
        company: "Acme Corp",
        jobTitle: "Frontend Developer",
        followUpDate: today,
      };

      vi.mocked(getFollowUpReminders).mockResolvedValue([job] as never);

      vi.mocked(findNotification).mockResolvedValue({
        id: "existing-notification",
      } as never);

      await generateNotifications(userId);

      expect(findNotification).toHaveBeenCalled();

      expect(createNotification).not.toHaveBeenCalled();

      expect(sendEmail).not.toHaveBeenCalled();
    });

    it("sends an email for a follow-up reminder when email notifications are enabled", async () => {
      const today = new Date();

      const job = {
        id: jobId,
        company: "Acme Corp",
        jobTitle: "Frontend Developer",
        followUpDate: today,
      };

      vi.mocked(getUserNotificationSettings).mockResolvedValue({
        emailNotifications: true,
        email: "user@example.com",
      } as never);

      vi.mocked(getFollowUpReminders).mockResolvedValue([job] as never);

      await generateNotifications(userId);

      expect(sendEmail).toHaveBeenCalledWith({
        to: "user@example.com",
        subject: "Follow-up Today",
        html: expect.stringContaining("Follow-up Today"),
      });
    });

    it("does not send an email when follow-up email notifications are disabled", async () => {
      const today = new Date();

      const job = {
        id: jobId,
        company: "Acme Corp",
        jobTitle: "Frontend Developer",
        followUpDate: today,
      };

      vi.mocked(getUserNotificationSettings).mockResolvedValue({
        emailNotifications: false,
        email: "user@example.com",
      } as never);

      vi.mocked(getFollowUpReminders).mockResolvedValue([job] as never);

      await generateNotifications(userId);

      expect(createNotification).toHaveBeenCalled();

      expect(sendEmail).not.toHaveBeenCalled();
    });

    it("does not process follow-up reminders when disabled by preferences", async () => {
      await generateNotifications(userId, {
        followUpReminders: false,
        interviewReminders: true,
      });

      expect(getFollowUpReminders).not.toHaveBeenCalled();

      expect(createNotification).not.toHaveBeenCalled();

      expect(sendEmail).not.toHaveBeenCalled();
    });
  });

  // ---------------------------------------------------------------------------
  // generateNotifications - preferences
  // ---------------------------------------------------------------------------

  describe("generateNotifications - preferences", () => {
    it("enables both reminder types by default", async () => {
      const today = new Date();

      const interview = {
        scheduledAt: today,
        job: {
          id: "interview-job",
          company: "Interview Corp",
        },
      };

      const followUpJob = {
        id: "followup-job",
        company: "Follow-up Corp",
        jobTitle: "Frontend Developer",
        followUpDate: today,
      };

      vi.mocked(getInterviewReminders).mockResolvedValue([interview] as never);

      vi.mocked(getFollowUpReminders).mockResolvedValue([followUpJob] as never);

      await generateNotifications(userId);

      expect(getInterviewReminders).toHaveBeenCalledWith(userId);

      expect(getFollowUpReminders).toHaveBeenCalledWith(userId);

      expect(createNotification).toHaveBeenCalledTimes(2);
    });

    it("always retrieves user email notification settings", async () => {
      await generateNotifications(userId, {
        followUpReminders: false,
        interviewReminders: false,
      });

      expect(getUserNotificationSettings).toHaveBeenCalledWith(userId);
    });
  });
});
