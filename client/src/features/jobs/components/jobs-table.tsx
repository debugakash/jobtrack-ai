import { DataTable } from "@/components/common/data-table";

import { useJobs } from "../hooks/use-jobs";

import { columns } from "./columns";

export default function JobsTable() {
  const { data, isLoading } = useJobs();

  if (isLoading) {
    return <p>Loading jobs...</p>;
  }

  return <DataTable columns={columns} data={data ?? []} />;
}
