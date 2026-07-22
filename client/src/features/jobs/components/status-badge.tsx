import { Badge } from "@/components/ui/badge";

interface Props {
  status: string;
}

export default function StatusBadge({ status }: Props) {
  switch (status) {
    case "Applied":
      return <Badge>{status}</Badge>;

    case "Interview":
      return <Badge variant="secondary">{status}</Badge>;

    case "Offer":
      return <Badge>{status}</Badge>;

    case "Rejected":
      return <Badge variant="destructive">{status}</Badge>;

    default:
      return <Badge variant="outline">{status}</Badge>;
  }
}
