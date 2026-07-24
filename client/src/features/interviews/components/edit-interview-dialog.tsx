import { useState } from "react";

import { Pencil } from "lucide-react";

import { Button } from "@/components/ui/button";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import InterviewForm from "./interview-form";

import type { Interview } from "../types/interview";

interface Props {
  jobId: string;
  interview: Interview;
}

export default function EditInterviewDialog({ jobId, interview }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="icon">
          <Pencil className="h-4 w-4" />
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>Edit Interview</DialogTitle>
        </DialogHeader>

        <InterviewForm
          jobId={jobId}
          mode="edit"
          interviewId={interview.id}
          initialData={interview}
          onSuccess={() => setOpen(false)}
        />
      </DialogContent>
    </Dialog>
  );
}
