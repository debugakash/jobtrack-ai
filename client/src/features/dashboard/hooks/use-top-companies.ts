import { useQuery } from "@tanstack/react-query";

import { getTopCompanies } from "../api/get-top-companies";

export function useTopCompanies() {
  return useQuery({
    queryKey: ["top-companies"],
    queryFn: getTopCompanies,
  });
}
