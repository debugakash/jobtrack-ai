import { SearchX } from "lucide-react";

import ErrorState from "@/components/common/error-state";

export default function NotFoundPage() {
  return (
    <ErrorState
      code="404"
      title="Page not found"
      description="Sorry, we couldn't find the page you're looking for."
      buttonText="Back to Dashboard"
      buttonLink="/"
      icon={<SearchX className="h-20 w-20 text-muted-foreground" />}
    />
  );
}
