import { useState } from "react";

import { Button } from "@/components/ui/button";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import InterviewForm from "./interview-form";

interface Props {
  jobId: string;
}

export default function ScheduleInterviewDialog({ jobId }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm">Schedule</Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>Schedule Interview</DialogTitle>
        </DialogHeader>

        <InterviewForm
          jobId={jobId}
          mode="create"
          onSuccess={() => setOpen(false)}
        />
      </DialogContent>
    </Dialog>
  );
}
