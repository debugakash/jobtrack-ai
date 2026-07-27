export interface Resume {
  id: string;

  originalName: string;

  storedName: string;

  label?: string | null;

  fileSize: number;

  mimeType: string;

  isDefault: boolean;

  createdAt: string;

  updatedAt: string;
}

export interface ResumeUploadRequest {
  resume: File;

  label?: string;
}
