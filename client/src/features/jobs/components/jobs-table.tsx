import { DataTable } from "@/components/common/data-table";

import { useJobs } from "../hooks/use-jobs";

import { columns } from "./columns";

import Pagination from "@/components/common/pagination";
import { useJobFilters } from "../hooks/use-job-filters";
import JobsTableSkeleton from "./jobs-table-skeleton";
import EmptyJobsState from "./empty-jobs-state";
import { useNavigate } from "react-router-dom";

export default function JobsTable() {
  const navigate = useNavigate();
  const { data, isLoading } = useJobs();
  const filters = useJobFilters();
  const pagination = data?.pagination;

  if (isLoading) {
    return <JobsTableSkeleton />;
  }

  const jobs = data?.data ?? [];

  if (jobs.length === 0) {
    return <EmptyJobsState />;
  }

  return (
    <div className="space-y-6">
      <DataTable
        columns={columns}
        data={data?.data ?? []}
        onRowClick={(job) => navigate(`/jobs/${job.id}`)}
      />

      {pagination && (
        <Pagination
          page={pagination.page}
          totalPages={pagination.totalPages}
          hasNextPage={pagination.hasNextPage}
          hasPreviousPage={pagination.hasPreviousPage}
          onPageChange={filters.setPage}
        />
      )}
    </div>
  );
}
