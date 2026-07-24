import type { ColumnDef } from "@tanstack/react-table";

import type { Job } from "../types/job";

import StatusBadge from "./status-badge";

import { Pencil, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";

import EditJobDialog from "./edit-job-dialog";

import DeleteJobDialog from "./delete-job-dialog";

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
  {
    id: "actions",

    cell: ({ row }) => {
      const job = row.original;

      return (
        <div className="flex items-center gap-2">
          <div onClick={(e) => e.stopPropagation()}>
            <EditJobDialog job={job}>
              <Button variant="outline" size="icon">
                <Pencil className="h-4 w-4" />
              </Button>
            </EditJobDialog>
          </div>

          <div onClick={(e) => e.stopPropagation()}>
            <DeleteJobDialog id={job.id} company={job.company}>
              <Button variant="destructive" size="icon">
                <Trash2 className="h-4 w-4" />
              </Button>
            </DeleteJobDialog>
          </div>
        </div>
      );
    },
  },
];
