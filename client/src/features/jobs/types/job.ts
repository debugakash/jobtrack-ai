export interface Job {
  id: string;
  company: string;
  jobTitle: string;
  location: string;
  status: "Wishlist" | "Applied" | "Interview" | "Offer" | "Rejected";

  salary?: string | null;

  jobUrl?: string | null;

  notes?: string | null;

  applicationDate: string;

  createdAt: string;

  updatedAt: string;
}
