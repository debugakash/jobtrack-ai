import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it, beforeEach } from "vitest";

import ProtectedRoute from "./protected-route";
import { useAuthStore } from "@/stores/auth-store";

describe("ProtectedRoute", () => {
  beforeEach(() => {
    useAuthStore.getState().logout();
  });

  it("redirects unauthenticated users to the login page", () => {
    render(
      <MemoryRouter initialEntries={["/dashboard"]}>
        <ProtectedRoute>
          <div>Protected Content</div>
        </ProtectedRoute>
      </MemoryRouter>,
    );

    expect(screen.queryByText("Protected Content")).not.toBeInTheDocument();
  });

  it("renders protected content for authenticated users", () => {
    useAuthStore.getState().login(
      {
        id: "test-user",
        firstName: "Test",
        lastName: "User",
        email: "test@example.com",
        avatar: null,
        avatarUrl: null,
        emailNotifications: true,
        interviewReminders: true,
        followUpReminders: true,
      },
      "test-token",
    );

    render(
      <MemoryRouter>
        <ProtectedRoute>
          <div>Protected Content</div>
        </ProtectedRoute>
      </MemoryRouter>,
    );

    expect(screen.getByText("Protected Content")).toBeInTheDocument();
  });
});
