import { Skeleton } from "@/components/ui/skeleton";

export default function DashboardSkeleton() {
  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <Skeleton className="h-9 w-56" />
        <Skeleton className="h-5 w-80" />
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 8 }).map((_, index) => (
          <Skeleton key={index} className="h-32 rounded-xl" />
        ))}
      </div>

      <Skeleton className="h-80 rounded-xl" />

      <Skeleton className="h-80 rounded-xl" />

      <Skeleton className="h-80 rounded-xl" />

      <Skeleton className="h-72 rounded-xl" />
    </div>
  );
}
