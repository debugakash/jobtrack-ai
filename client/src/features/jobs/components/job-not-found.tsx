import { Link } from "react-router-dom";

import { Button } from "@/components/ui/button";

export default function JobNotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4">
      <h2 className="text-2xl font-bold">Job not found</h2>

      <p className="text-muted-foreground">
        The requested job doesn't exist or has been deleted.
      </p>

      <Button asChild>
        <Link to="/jobs">Back to Jobs</Link>
      </Button>
    </div>
  );
}
