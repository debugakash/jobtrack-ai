export interface RecentActivity {
  id: string;
  type:
    | "CREATED"
    | "STATUS_CHANGED"
    | "NOTE"
    | "FOLLOW_UP"
    | "INTERVIEW"
    | "OFFER"
    | "REJECTED"
    | "OTHER";

  title: string;
  description: string | null;
  eventDate: string;

  job: {
    id: string;
    company: string;
    jobTitle: string;
  };
}
