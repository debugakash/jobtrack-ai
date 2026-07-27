import { useQuery } from "@tanstack/react-query";

import { getResumes } from "../api/get-resumes";

export function useResumes() {
  return useQuery({
    queryKey: ["resumes"],

    queryFn: getResumes,
  });
}
