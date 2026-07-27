import { useState } from "react";

import { Upload } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { useUploadResume } from "../hooks/use-upload-resume";

export default function UploadResumeDialog() {
  const [open, setOpen] = useState(false);

  const [file, setFile] = useState<File>();

  const [label, setLabel] = useState("");

  const mutation = useUploadResume();

  function handleUpload() {
    if (!file) return;

    mutation.mutate(
      {
        file,
        label,
      },
      {
        onSuccess: () => {
          setOpen(false);
          setFile(undefined);
          setLabel("");
        },
      },
    );
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Upload className="mr-2 h-4 w-4" />
          Upload Resume
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Upload Resume</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <Input
            placeholder="Label (Frontend Resume)"
            value={label}
            onChange={(e) => setLabel(e.target.value)}
          />

          <Input
            type="file"
            accept=".pdf,.doc,.docx"
            onChange={(e) => {
              const selected = e.target.files?.[0];
              if (selected) {
                setFile(selected);
              }
            }}
          />

          <Button
            className="w-full"
            onClick={handleUpload}
            disabled={!file || mutation.isPending}
          >
            {mutation.isPending ? "Uploading..." : "Upload Resume"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
