import { Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

import { useDeleteInterview } from "../hooks/use-delete-interview";

interface Props {
  jobId: string;
  interviewId: string;
  round: string;
}

export default function DeleteInterviewDialog({
  jobId,
  interviewId,
  round,
}: Props) {
  const mutation = useDeleteInterview(jobId);

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="destructive" size="icon">
          <Trash2 className="h-4 w-4" />
        </Button>
      </AlertDialogTrigger>

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete interview?</AlertDialogTitle>

          <AlertDialogDescription>
            This will permanently delete <strong>{round}</strong>.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>

          <AlertDialogAction onClick={() => mutation.mutate(interviewId)}>
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
