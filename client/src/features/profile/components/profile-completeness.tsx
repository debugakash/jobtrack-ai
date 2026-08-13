import { CheckCircle2 } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

import { useAuthStore } from "@/stores/auth-store";
import { getProfileCompleteness } from "../lib/profile-completeness";
import { useResumes } from "@/features/resumes/hooks/use-resumes";

export default function ProfileCompleteness() {
  const user = useAuthStore((state) => state.user);

  const { data: resumes } = useResumes();

  const hasDefaultResume = resumes?.some((resume) => resume.isDefault) ?? false;

  const percentage = getProfileCompleteness({
    profile: user,
    hasDefaultResume,
  });

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-medium text-muted-foreground">
              Profile Completeness
            </p>

            <h2 className="mt-1 text-2xl font-bold">{percentage}%</h2>
          </div>

          {percentage === 100 && (
            <CheckCircle2 className="h-5 w-5 text-green-600" />
          )}
        </div>

        <Progress value={percentage} className="mt-4" />

        <p className="mt-3 text-sm text-muted-foreground">
          {percentage === 100
            ? "Your profile is complete."
            : "Complete your profile to get the most out of JobTrack AI."}
        </p>
      </CardContent>
    </Card>
  );
}
