import { api } from "@/lib/api";

export async function uploadResume(file: File, label?: string) {
  const formData = new FormData();

  formData.append("resume", file);

  if (label) {
    formData.append("label", label);
  }

  const response = await api.post("/resumes", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data.data;
}
