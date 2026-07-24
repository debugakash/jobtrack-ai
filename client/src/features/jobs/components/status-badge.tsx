import { Badge } from "@/components/ui/badge";
import { formatEnum } from "@/lib/format";

interface Props {
  status: string;
}

const variants: Record<
  string,
  "default" | "secondary" | "destructive" | "outline"
> = {
  WISHLIST: "outline",
  APPLIED: "default",
  SCREENING: "secondary",
  INTERVIEW: "secondary",
  OFFER: "default",
  ACCEPTED: "default",
  REJECTED: "destructive",
};

export default function StatusBadge({ status }: Props) {
  return (
    <Badge variant={variants[status] ?? "outline"}>{formatEnum(status)}</Badge>
  );
}
