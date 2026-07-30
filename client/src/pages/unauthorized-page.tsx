import { ShieldAlert } from "lucide-react";
import ErrorState from "@/components/common/error-state";

export default function UnauthorizedPage() {
  return (
    <ErrorState
      code="401"
      title="Unauthorized"
      description="Please log in to continue."
      buttonText="Login"
      buttonLink="/login"
      icon={<ShieldAlert className="h-20 w-20 text-muted-foreground" />}
    />
  );
}
