import { Button } from "@/components/ui/button";

interface PaginationProps {
  page: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;

  onPageChange: (page: number) => void;
}

export default function Pagination({
  page,
  totalPages,
  hasNextPage,
  hasPreviousPage,
  onPageChange,
}: PaginationProps) {
  return (
    <div className="flex items-center justify-between pt-6">
      <Button
        variant="outline"
        disabled={!hasPreviousPage}
        onClick={() => onPageChange(page - 1)}
      >
        Previous
      </Button>

      <span className="text-sm text-muted-foreground">
        Page {page} of {totalPages}
      </span>

      <Button
        variant="outline"
        disabled={!hasNextPage}
        onClick={() => onPageChange(page + 1)}
      >
        Next
      </Button>
    </div>
  );
}
