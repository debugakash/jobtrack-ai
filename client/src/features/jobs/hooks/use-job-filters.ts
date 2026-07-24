import { useSearchParams } from "react-router-dom";

export function useJobFilters() {
  const [searchParams, setSearchParams] = useSearchParams();

  const page = Number(searchParams.get("page") ?? 1);
  const limit = Number(searchParams.get("limit") ?? 10);

  function updateFilter(key: string, value: string) {
    const params = new URLSearchParams(searchParams);

    if (!value || value === "ALL") {
      params.delete(key);
    } else {
      params.set(key, value);
    }

    // Reset page whenever a filter (except page/limit) changes
    if (key !== "page" && key !== "limit") {
      params.set("page", "1");
    }

    setSearchParams(params);
  }

  function setPage(page: number) {
    updateFilter("page", page.toString());
  }

  return {
    search: searchParams.get("search") ?? "",
    status: searchParams.get("status") ?? "",
    jobType: searchParams.get("jobType") ?? "",
    workMode: searchParams.get("workMode") ?? "",
    sort: searchParams.get("sort") ?? "newest",

    page,
    limit,

    updateFilter,
    setPage,
  };
}
