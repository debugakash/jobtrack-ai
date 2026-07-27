import { api } from "@/lib/api";

export async function downloadResume(id: string) {
  const response = await api.get(`/resumes/${id}/download`, {
    responseType: "blob",
  });

  const blob = new Blob([response.data]);

  const url = window.URL.createObjectURL(blob);

  const link = document.createElement("a");

  link.href = url;

  const disposition = response.headers["content-disposition"];

  let filename = "resume.pdf";

  if (disposition) {
    const match = disposition.match(/filename="?([^"]+)"?/);

    if (match) {
      filename = match[1];
    }
  }

  link.download = filename;

  document.body.appendChild(link);

  link.click();

  link.remove();

  window.URL.revokeObjectURL(url);
}
