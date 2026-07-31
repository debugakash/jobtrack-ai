export interface Notification {
  id: string;
  title: string;
  message: string;
  type: "FOLLOW_UP" | "INTERVIEW" | "JOB_STATUS" | "SYSTEM";
  isRead: boolean;
  actionUrl: string | null;
  createdAt: string;
}

export type NotificationsResponse = Notification[];
