import { useState } from "react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";

import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

import { Label } from "@/components/ui/label";

import { useResumes } from "@/features/resumes/hooks/use-resumes";

import { useAttachResume } from "../hooks/use-attach-resume";

interface Props {
  jobId: string;
  currentResumeId?: string | null;
}

export default function AttachResumeDialog({ jobId, currentResumeId }: Props) {
  const [open, setOpen] = useState(false);

  const [selected, setSelected] = useState(currentResumeId ?? "");

  const { data: resumes } = useResumes();

  const mutation = useAttachResume(jobId);

  function handleAttach() {
    mutation.mutate(selected || null, {
      onSuccess: () => {
        setOpen(false);
      },
    });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          {currentResumeId ? "Change Resume" : "Attach Resume"}
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Select Resume</DialogTitle>
        </DialogHeader>

        <RadioGroup value={selected} onValueChange={setSelected}>
          {resumes?.map((resume) => (
            <div key={resume.id} className="flex items-center space-x-2">
              <RadioGroupItem value={resume.id} id={resume.id} />

              <Label htmlFor={resume.id}>
                {resume.label || resume.originalName}
                {resume.isDefault && " ⭐"}
              </Label>
            </div>
          ))}
        </RadioGroup>

        <Button
          className="w-full"
          onClick={handleAttach}
          disabled={mutation.isPending}
        >
          {mutation.isPending ? "Saving..." : "Attach Resume"}
        </Button>
      </DialogContent>
    </Dialog>
  );
}
