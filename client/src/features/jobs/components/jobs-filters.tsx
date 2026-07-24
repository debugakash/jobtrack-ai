import { useEffect, useState } from "react";
import { useDebounce } from "@/hooks/use-debounce";

import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { JOB_STATUSES, JOB_TYPES, WORK_MODES } from "@/constants/job";

import { formatEnum } from "@/lib/format";

import { useJobFilters } from "../hooks/use-job-filters";

export default function JobsFilters() {
  const {
    search: filterSearch,
    updateFilter,
    status,
    jobType,
    workMode,
    sort,
  } = useJobFilters();

  const [search, setSearch] = useState(filterSearch);

  const debouncedSearch = useDebounce(search, 400);

  useEffect(() => {
    if (debouncedSearch !== filterSearch) {
      updateFilter("search", debouncedSearch);
    }
  }, [debouncedSearch, filterSearch, updateFilter]);

  return (
    <div className="flex flex-wrap gap-4">
      <Input
        placeholder="Search company or job title..."
        className="w-72"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <Select
        value={status || "ALL"}
        onValueChange={(value) => updateFilter("status", value)}
      >
        <SelectTrigger className="w-44">
          <SelectValue placeholder="Status" />
        </SelectTrigger>

        <SelectContent>
          <SelectItem value="ALL">All Statuses</SelectItem>

          {JOB_STATUSES.map((status) => (
            <SelectItem key={status} value={status}>
              {formatEnum(status)}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={jobType || "ALL"}
        onValueChange={(value) => updateFilter("jobType", value)}
      >
        <SelectTrigger className="w-44">
          <SelectValue placeholder="Job Type" />
        </SelectTrigger>

        <SelectContent>
          <SelectItem value="ALL">All Types</SelectItem>

          {JOB_TYPES.map((type) => (
            <SelectItem key={type} value={type}>
              {formatEnum(type)}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={workMode || "ALL"}
        onValueChange={(value) => updateFilter("workMode", value)}
      >
        <SelectTrigger className="w-44">
          <SelectValue placeholder="Work Mode" />
        </SelectTrigger>

        <SelectContent>
          <SelectItem value="ALL">All Modes</SelectItem>

          {WORK_MODES.map((mode) => (
            <SelectItem key={mode} value={mode}>
              {formatEnum(mode)}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={sort}
        onValueChange={(value) => updateFilter("sort", value)}
      >
        <SelectTrigger className="w-52">
          <SelectValue placeholder="Sort By" />
        </SelectTrigger>

        <SelectContent>
          <SelectItem value="newest">Newest</SelectItem>
          <SelectItem value="oldest">Oldest</SelectItem>
          <SelectItem value="company_asc">Company (A-Z)</SelectItem>
          <SelectItem value="company_desc">Company (Z-A)</SelectItem>
          <SelectItem value="salary_asc">Salary (Low → High)</SelectItem>
          <SelectItem value="salary_desc">Salary (High → Low)</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
