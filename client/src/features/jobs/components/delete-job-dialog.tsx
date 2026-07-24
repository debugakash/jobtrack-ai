import { useState } from "react";

import type { ReactNode } from "react";

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";

import { useDeleteJob } from "../hooks/use-delete-job";

interface Props {
  id: string;
  company: string;
  children: ReactNode;
}

export default function DeleteJobDialog({ id, company, children }: Props) {
  const [open, setOpen] = useState(false);

  const deleteJob = useDeleteJob();

  async function handleDelete() {
    await deleteJob.mutateAsync(id);

    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Job</DialogTitle>
        </DialogHeader>

        <p>
          Are you sure you want to delete <b>{company}</b>?
        </p>

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>

          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={deleteJob.isPending}
          >
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
