import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it, beforeEach } from "vitest";

import PublicRoute from "./public-route";
import { useAuthStore } from "@/stores/auth-store";

describe("PublicRoute", () => {
  beforeEach(() => {
    useAuthStore.getState().logout();
  });

  it("renders public content for unauthenticated users", () => {
    render(
      <MemoryRouter>
        <PublicRoute>
          <div>Login Content</div>
        </PublicRoute>
      </MemoryRouter>,
    );

    expect(screen.getByText("Login Content")).toBeInTheDocument();
  });

  it("does not render public content for authenticated users", () => {
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
        <PublicRoute>
          <div>Login Content</div>
        </PublicRoute>
      </MemoryRouter>,
    );

    expect(screen.queryByText("Login Content")).not.toBeInTheDocument();
  });
});
