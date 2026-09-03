import { describe, expect, it, vi } from "vitest";

import { api } from "@/lib/api";

import { updateProfile } from "./update-profile";

describe("updateProfile", () => {
  it("updates the profile with the provided data", async () => {
    const patchSpy = vi.spyOn(api, "patch").mockResolvedValue({
      data: {
        data: {},
      },
    } as never);

    const profileData = {
      firstName: "Akash",
      lastName: "Arya",
      phone: "9876543210",
      location: "Indore",
      headline: "Full Stack Developer",
      bio: "Developer",
      linkedinUrl: "https://linkedin.com/in/akash",
      githubUrl: "https://github.com/akash",
      portfolioUrl: "https://example.com",
      skills: "React, TypeScript, Node.js",
    };

    await updateProfile(profileData);

    expect(patchSpy).toHaveBeenCalledWith("/users/me", profileData);
  });

  it("returns the updated profile data from the API response", async () => {
    const updatedProfile = {
      firstName: "Akash",
      lastName: "Arya",
    };

    vi.spyOn(api, "patch").mockResolvedValue({
      data: {
        data: updatedProfile,
      },
    } as never);

    const result = await updateProfile({
      firstName: "Akash",
      lastName: "Arya",
    });

    expect(result).toEqual(updatedProfile);
  });
});
