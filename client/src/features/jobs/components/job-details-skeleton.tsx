import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export default function JobDetailsSkeleton() {
  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <Skeleton className="h-8 w-36" />

        <div className="space-y-2">
          <Skeleton className="h-10 w-72" />
          <Skeleton className="h-6 w-56" />
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-40" />
          </CardHeader>

          <CardContent className="space-y-5">
            {[...Array(5)].map((_, index) => (
              <Skeleton key={index} className="h-6 w-full" />
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-24" />
          </CardHeader>

          <CardContent className="space-y-3">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-11/12" />
            <Skeleton className="h-4 w-10/12" />
            <Skeleton className="h-4 w-8/12" />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
