import { Skeleton } from "@/components/ui/skeleton";

export default function JobsTableSkeleton() {
  return (
    <div className="space-y-4">
      <Skeleton className="h-10 w-full" />

      {Array.from({ length: 8 }).map((_, index) => (
        <Skeleton key={index} className="h-14 w-full rounded-md" />
      ))}
    </div>
  );
}
