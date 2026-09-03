import { describe, expect, it, vi } from "vitest";

import { api } from "@/lib/api";
import { getTopCompanies } from "./get-top-companies";

vi.mock("@/lib/api", () => ({
  api: {
    get: vi.fn(),
  },
}));

describe("getTopCompanies", () => {
  it("calls the top companies endpoint", async () => {
    vi.mocked(api.get).mockResolvedValue({
      data: {
        success: true,
        data: [],
      },
    } as never);

    await getTopCompanies();

    expect(api.get).toHaveBeenCalledWith("/dashboard/top-companies");
  });

  it("returns the top companies data", async () => {
    const companies = [
      {
        company: "Google",
        count: 5,
      },
      {
        company: "Microsoft",
        count: 3,
      },
    ];

    vi.mocked(api.get).mockResolvedValue({
      data: {
        success: true,
        data: companies,
      },
    } as never);

    const result = await getTopCompanies();

    expect(result).toEqual(companies);
  });
});
