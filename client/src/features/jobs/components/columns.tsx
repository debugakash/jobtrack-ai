import type { ColumnDef } from "@tanstack/react-table";

import type { Job } from "../types/job";

import StatusBadge from "./status-badge";

export const columns: ColumnDef<Job>[] = [
  {
    accessorKey: "company",
    header: "Company",
  },
  {
    accessorKey: "jobTitle",
    header: "Job Title",
  },
  {
    accessorKey: "location",
    header: "Location",
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => <StatusBadge status={row.original.status} />,
  },
  {
    accessorKey: "applicationDate",
    header: "Applied",
  },
];
