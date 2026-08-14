import { createBrowserRouter } from "react-router-dom";

import AppLayout from "@/components/layout/app-layout";

import LoginPage from "@/features/auth/pages/login-page";
import RegisterPage from "@/features/auth/pages/register-page";
import ForgotPasswordPage from "@/features/auth/pages/forgot-password-page";
import ResetPasswordPage from "@/features/auth/pages/reset-password-page";
import DashboardPage from "@/features/dashboard/pages/dashboard-page";

import ProtectedRoute from "./protected-route";
import PublicRoute from "./public-route";
import JobsPage from "@/features/jobs/pages/jobs-page";
import InterviewsPage from "@/features/interviews/pages/interviews-page";
import ResumesPage from "@/features/resumes/pages/resumes-page";
import SettingsPage from "@/features/settings/pages/settings-page";
import ProfilePage from "@/features/profile/pages/profile-page";
import JobDetailsPage from "@/features/jobs/pages/job-details-page";
import NotFoundPage from "@/pages/not-found-page";
import AnalyticsPage from "@/features/analytics/pages/analytics-page";
import ActivityPage from "@/features/activity/pages/activity-page";
import BoardPage from "@/features/board/pages/board-page";
import CalendarPage from "@/features/calendar/pages/calendar-page";

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
        path: "/board",
        element: <BoardPage />,
      },
      {
        path: "/jobs/:id",
        element: <JobDetailsPage />,
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
      {
        path: "/analytics",
        element: <AnalyticsPage />,
      },
      {
        path: "/activity",
        element: <ActivityPage />,
      },
      {
        path: "/calendar",
        element: <CalendarPage />,
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
  {
    path: "/forgot-password",
    element: (
      <PublicRoute>
        <ForgotPasswordPage />
      </PublicRoute>
    ),
  },
  {
    path: "/reset-password",
    element: (
      <PublicRoute>
        <ResetPasswordPage />
      </PublicRoute>
    ),
  },
  {
    path: "*",
    element: <NotFoundPage />,
  },
]);
