import { Badge } from "@/components/ui/badge";
import { formatEnum } from "@/lib/format";

interface Props {
  status: string;
}

export default function StatusBadge({ status }: Props) {
  const label = formatEnum(status);

  switch (status) {
    case "APPLIED":
      return <Badge>{label}</Badge>;

    case "SCREENING":
      return <Badge variant="secondary">{label}</Badge>;

    case "INTERVIEW":
      return <Badge variant="secondary">{label}</Badge>;

    case "OFFER":
      return <Badge>{label}</Badge>;

    case "ACCEPTED":
      return <Badge>{label}</Badge>;

    case "REJECTED":
      return <Badge variant="destructive">{label}</Badge>;

    case "WISHLIST":
    default:
      return <Badge variant="outline">{label}</Badge>;
  }
}
