import { createBrowserRouter } from "react-router-dom";

import AppLayout from "@/components/layout/app-layout";

import LoginPage from "@/features/auth/pages/login-page";
import RegisterPage from "@/features/auth/pages/register-page";
import DashboardPage from "@/features/dashboard/pages/dashboard-page";

import ProtectedRoute from "./protected-route";
import PublicRoute from "./public-route";
import JobsPage from "@/features/jobs/pages/jobs-page";
import InterviewsPage from "@/features/interviews/pages/interviews-page";
import ResumesPage from "@/features/resumes/pages/resumes-page";
import SettingsPage from "@/features/settings/pages/settings-page";
import ProfilePage from "@/features/profile/pages/profile-page";

export const router = createBrowserRouter([
  {
    element: (
      <ProtectedRoute>
        <AppLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        path: "/",
        element: <DashboardPage />,
      },
      {
        path: "/jobs",
        element: <JobsPage />,
      },
      {
        path: "/interviews",
        element: <InterviewsPage />,
      },
      {
        path: "/resumes",
        element: <ResumesPage />,
      },
      {
        path: "/settings",
        element: <SettingsPage />,
      },
      {
        path: "/profile",
        element: <ProfilePage />,
      },
    ],
  },
  {
    path: "/login",
    element: (
      <PublicRoute>
        <LoginPage />
      </PublicRoute>
    ),
  },
  {
    path: "/register",
    element: (
      <PublicRoute>
        <RegisterPage />
      </PublicRoute>
    ),
  },
]);
