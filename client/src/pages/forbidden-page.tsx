import { Ban } from "lucide-react";
import ErrorState from "@/components/common/error-state";

export default function ForbiddenPage() {
  return (
    <ErrorState
      code="403"
      title="Access denied"
      description="You don't have permission to view this page."
      buttonText="Back"
      buttonLink="/"
      icon={<Ban className="h-20 w-20 text-muted-foreground" />}
    />
  );
}
