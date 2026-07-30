import { TriangleAlert } from "lucide-react";
import ErrorState from "@/components/common/error-state";

export default function ServerErrorPage() {
  return (
    <ErrorState
      code="500"
      title="Something went wrong"
      description="An unexpected error occurred."
      buttonText="Back to Dashboard"
      buttonLink="/"
      icon={<TriangleAlert className="h-20 w-20 text-muted-foreground" />}
    />
  );
}
