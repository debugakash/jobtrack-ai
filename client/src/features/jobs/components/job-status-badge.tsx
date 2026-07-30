import { Badge } from "@/components/ui/badge";

import type { Job } from "../types/job";

interface Props {
  status: Job["status"];
}

const statusStyles: Record<Job["status"], string> = {
  WISHLIST: "bg-slate-500 hover:bg-slate-500 text-white",

  APPLIED: "bg-blue-600 hover:bg-blue-600 text-white",

  SCREENING: "bg-amber-500 hover:bg-amber-500 text-black",

  INTERVIEW: "bg-violet-600 hover:bg-violet-600 text-white",

  OFFER: "bg-green-600 hover:bg-green-600 text-white",

  ACCEPTED: "bg-emerald-600 hover:bg-emerald-600 text-white",

  REJECTED: "bg-red-600 hover:bg-red-600 text-white",
};

const statusLabels: Record<Job["status"], string> = {
  WISHLIST: "Wishlist",
  APPLIED: "Applied",
  SCREENING: "Screening",
  INTERVIEW: "Interview",
  OFFER: "Offer",
  ACCEPTED: "Accepted",
  REJECTED: "Rejected",
};

export default function JobStatusBadge({ status }: Props) {
  return <Badge className={statusStyles[status]}>{statusLabels[status]}</Badge>;
}
