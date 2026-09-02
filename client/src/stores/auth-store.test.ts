import { beforeEach, describe, expect, it } from "vitest";

import { useAuthStore } from "./auth-store";

import type { User } from "@/features/auth/types/auth";

const mockUser: User = {
  id: "user-1",
  firstName: "Akash",
  lastName: "Arya",
  email: "akash@example.com",
  avatar: null,
  avatarUrl: null,
  emailNotifications: true,
  interviewReminders: true,
  followUpReminders: true,
};

describe("useAuthStore", () => {
  beforeEach(() => {
    localStorage.clear();

    useAuthStore.setState({
      user: null,
      accessToken: null,
      isAuthenticated: false,
    });
  });

  it("starts with an unauthenticated state", () => {
    const state = useAuthStore.getState();

    expect(state.user).toBeNull();
    expect(state.accessToken).toBeNull();
    expect(state.isAuthenticated).toBe(false);
  });

  it("logs the user in", () => {
    useAuthStore.getState().login(mockUser, "test-token");

    const state = useAuthStore.getState();

    expect(state.user).toEqual(mockUser);
    expect(state.accessToken).toBe("test-token");
    expect(state.isAuthenticated).toBe(true);
  });

  it("updates the authenticated user's information", () => {
    useAuthStore.getState().login(mockUser, "test-token");

    useAuthStore.getState().updateUser({
      firstName: "Updated",
      lastName: "User",
    });

    const state = useAuthStore.getState();

    expect(state.user).toEqual({
      ...mockUser,
      firstName: "Updated",
      lastName: "User",
    });

    expect(state.accessToken).toBe("test-token");
    expect(state.isAuthenticated).toBe(true);
  });

  it("does not create a user when updateUser is called while logged out", () => {
    useAuthStore.getState().updateUser({
      firstName: "Updated",
    });

    const state = useAuthStore.getState();

    expect(state.user).toBeNull();
  });

  it("logs the user out", () => {
    useAuthStore.getState().login(mockUser, "test-token");

    useAuthStore.getState().logout();

    const state = useAuthStore.getState();

    expect(state.user).toBeNull();
    expect(state.accessToken).toBeNull();
    expect(state.isAuthenticated).toBe(false);
  });
});
