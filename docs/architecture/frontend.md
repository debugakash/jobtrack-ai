# Frontend Architecture

## Overview

JobTrack AI uses a React-based frontend built with React 19, TypeScript, and Vite.

The frontend follows a feature-based architecture that separates application features, shared UI components, routing, server-state management, client-state management, and infrastructure concerns.

The frontend is responsible for:

- User authentication
- Job application management
- Job board management
- Job activity tracking
- Interview scheduling and tracking
- Follow-up management
- Resume management
- Resume-to-job association
- Dashboard and analytics
- Calendar functionality
- Notifications
- User profile and settings
- AI-powered job analysis
- Responsive user interface

The frontend communicates with the Express.js backend through REST APIs.

---

## Tech Stack

The frontend uses:

- React 19
- TypeScript
- Vite
- React Router
- TanStack React Query
- Zustand
- Axios
- React Hook Form
- Zod
- Tailwind CSS
- shadcn/ui
- Radix UI
- Recharts
- dnd-kit
- date-fns
- Lucide React
- Sonner
- Vitest
- React Testing Library

The application uses TanStack React Query for server-state management and Zustand for client-side application state.

---

## Project Structure

```text
client/
└── src/
    ├── app/
    │   ├── layouts/
    │   ├── providers/
    │   │   └── query-provider.tsx
    │   └── router/
    │
    ├── assets/
    ├── components/
    ├── config/
    ├── constants/
    │
    ├── features/
    │   ├── activity/
    │   ├── analytics/
    │   ├── auth/
    │   ├── board/
    │   ├── calendar/
    │   ├── dashboard/
    │   ├── interviews/
    │   ├── jobs/
    │   ├── notifications/
    │   ├── profile/
    │   ├── resumes/
    │   └── settings/
    │
    ├── hooks/
    ├── lib/
    ├── pages/
    ├── routes/
    │   ├── index.tsx
    │   ├── protected-route.tsx
    │   └── public-route.tsx
    │
    ├── services/
    ├── stores/
    │   └── auth-store.ts
    ├── styles/
    ├── types/
    ├── utils/
    │
    ├── App.css
    ├── App.tsx
    ├── index.css
    └── main.tsx
```

Some directories are currently reserved for shared functionality that may expand as the application grows.

---

## Feature-Based Architecture

The `features/` directory contains domain-specific application functionality.

```text
features/
├── activity/
├── analytics/
├── auth/
├── board/
├── calendar/
├── dashboard/
├── interviews/
├── jobs/
├── notifications/
├── profile/
├── resumes/
└── settings/
```

Each feature represents a specific business capability.

This approach keeps related functionality together instead of organizing the entire application only by technical type.

For example:

```text
features/
└── jobs/
    ├── components/
    ├── hooks/
    ├── schemas/
    └── ...
```

A feature can contain its own:

- Components
- Hooks
- Forms
- Validation schemas
- Feature-specific types
- Query logic
- UI behavior

Shared functionality should remain outside the feature when it is genuinely reusable across multiple application areas.

---

## Application Layer

The `app/` directory contains application-level configuration and composition.

```text
app/
├── layouts/
├── providers/
│   └── query-provider.tsx
└── router/
```

This layer contains concerns that apply to the application as a whole, including:

- Application layouts
- Providers
- Router configuration
- Global application composition

Keeping these concerns separate prevents individual features from becoming responsible for application-wide configuration.

---

## Application Entry Point

The frontend application starts from:

```text
src/main.tsx
```

The root application component is:

```text
src/App.tsx
```

The general application startup flow is:

```text
main.tsx
    │
    ▼
App.tsx
    │
    ▼
Application Providers
    │
    ▼
Router
    │
    ▼
Layouts
    │
    ▼
Pages
    │
    ▼
Feature Components
```

`main.tsx` bootstraps the React application while `App.tsx` composes the primary application structure.

---

## Routing

Application routing is implemented using React Router.

The route configuration is located under:

```text
src/routes/
```

The routing structure includes:

```text
routes/
├── index.tsx
├── protected-route.tsx
└── public-route.tsx
```

Routing is separated into public and protected areas.

### Public Routes

Public routes are accessible without an authenticated session.

Examples include:

- Login
- Registration
- Forgot password
- Reset password

### Protected Routes

Protected routes require an authenticated user.

The `protected-route.tsx` component prevents unauthenticated users from accessing protected application areas.

Protected areas include functionality such as:

- Dashboard
- Jobs
- Job board
- Interviews
- Calendar
- Resumes
- Notifications
- Analytics
- Profile
- Settings
- AI analysis

---

## Layout Architecture

Application layouts are separated from individual pages.

Layouts are responsible for shared application structure such as:

- Navigation
- Sidebar
- Header
- Main content area
- Authenticated application shell

This prevents each page from having to recreate the application's global navigation structure.

The general structure is:

```text
Authenticated Layout
       │
       ├── Navigation
       ├── Sidebar
       └── Main Content
               │
               └── Route Page
```

---

## Server-State Management

JobTrack AI uses TanStack React Query for server-state management.

The Query Client is configured through:

```text
src/app/providers/query-provider.tsx
```

React Query is responsible for:

- Fetching server data
- Caching
- Query invalidation
- Refetching
- Loading states
- Error states
- Synchronizing server data with the UI

Server data should generally remain managed by React Query instead of being duplicated in global client state.

Examples include:

- Jobs
- Interviews
- Resumes
- Notifications
- Dashboard data
- Analytics data
- AI analysis results
- User profile data

---

## Client-State Management

Zustand is used for client-side application state.

The primary authentication store is:

```text
src/stores/auth-store.ts
```

Zustand provides shared client state without requiring prop drilling through the component tree.

The current state-management strategy separates state based on responsibility:

```text
                    Frontend State
                         │
              ┌──────────┴──────────┐
              │                     │
        Server State           Client State
              │                     │
              ▼                     ▼
    TanStack React Query          Zustand
              │                     │
              ▼                     ▼
        Backend Data          Application State
```

This prevents server data from being unnecessarily copied into global client state.

---

## Authentication State

Authentication state is managed through the Zustand authentication store.

The authentication flow is:

```text
Login Form
    │
    ▼
Authentication API
    │
    ▼
Authentication Response
    │
    ▼
Zustand Auth Store
    │
    ▼
Protected Routes
    │
    ▼
Authenticated Application
```

Authentication state is used by the routing layer and application UI to determine whether protected content should be accessible.

---

## API Communication

The frontend communicates with the backend through REST APIs.

Axios is used as the HTTP client.

The API base URL is configured through the Vite environment variable:

```text
VITE_API_URL
```

The example configuration is:

```env
VITE_API_URL=http://localhost:5000/api
```

The frontend does not hardcode the production backend URL into application components.

The general communication flow is:

```text
React Component
       │
       ▼
Feature Hook / Query
       │
       ▼
Axios
       │
       ▼
Express REST API
       │
       ▼
Backend Services
       │
       ▼
PostgreSQL / External Services
```

The `services/` directory is reserved for API and external-service integration as the frontend architecture evolves.

---

## Forms and Validation

The frontend uses:

- React Hook Form for form state and submission handling
- Zod for schema-based validation
- `@hookform/resolvers` for integrating Zod with React Hook Form

This provides a consistent approach to form handling and validation.

The general flow is:

```text
User Input
    │
    ▼
React Hook Form
    │
    ▼
Zod Schema
    │
    ▼
Validation
    │
    ├── Invalid → Display Validation Error
    │
    └── Valid
          │
          ▼
      API Request
```

Validation rules can remain separate from presentation components while maintaining TypeScript type safety.

---

## UI Architecture

The application uses shared UI components together with feature-specific components.

Shared components are located under:

```text
src/components/
```

Feature-specific components are located under:

```text
src/features/<feature>/
```

Shared components can include:

- Buttons
- Inputs
- Dialogs
- Cards
- Tables
- Dropdowns
- Modals
- Loading states
- Error states
- Navigation components

Feature-specific components remain within their feature when they contain business-specific behavior.

---

## Styling

The frontend uses Tailwind CSS together with shadcn/ui and Radix UI.

Global styling is handled through:

```text
src/index.css
```

Application-level styling is also available through:

```text
src/App.css
```

The project also contains:

```text
src/styles/
```

as a location for additional shared styling if required.

The styling architecture favors utility-based styling and reusable component primitives.

---

## Dashboard and Analytics

The frontend uses Recharts for data visualization.

Charts are used across dashboard and analytics functionality for metrics such as:

- Application statistics
- Job status distribution
- Application trends
- Source distribution
- Company statistics
- Other job-search metrics

The charting layer is kept within the relevant dashboard or analytics features rather than introducing a separate application-wide charting layer.

---

## Job Board

The application uses `dnd-kit` for drag-and-drop interactions.

The job board allows users to organize jobs across application statuses through an interactive interface.

The general interaction flow is:

```text
Job Card
   │
   ▼
Drag
   │
   ▼
Drop on Status Column
   │
   ▼
Update Job Status
   │
   ▼
API Request
   │
   ▼
React Query Cache Update / Invalidation
```

This combines client-side interaction handling with server-state synchronization.

---

## Date Handling

The frontend uses `date-fns` for date manipulation and formatting.

Date-related functionality is used throughout:

- Job applications
- Follow-ups
- Interviews
- Calendar
- Notifications
- Dashboard statistics
- Analytics

Using a common date utility library keeps date calculations and formatting consistent across features.

---

## Notifications

The application has an in-app notification system and uses Sonner for immediate toast feedback.

The notification feature handles application-level notifications such as:

- Follow-up reminders
- Interview reminders
- Job-related events
- System notifications
- Read/unread state

Sonner is used for transient UI feedback such as:

- Successful creation
- Successful updates
- Successful deletion
- Validation errors
- API errors
- Other user actions

These two mechanisms serve different purposes:

```text
Notification System
    │
    ├── Persistent / actionable notifications
    │
    └── Sonner
          └── Temporary UI feedback
```

---

## Resume Management

Resume functionality is organized under:

```text
src/features/resumes/
```

The frontend supports:

- Resume upload
- Resume listing
- Resume metadata
- Default resume selection
- Resume deletion
- Resume-to-job association

Resume files are uploaded through the backend API and stored in Supabase Storage.

The frontend does not directly manage the underlying storage provider.

The general flow is:

```text
Resume Form
    │
    ▼
Frontend Upload
    │
    ▼
Backend API
    │
    ▼
Storage Service
    │
    ▼
Supabase Storage
```

---

## Resume-to-Job Integration

A resume can be associated with a job application.

This allows users to identify which resume is being used for a particular application.

The frontend exposes this relationship through the job and resume workflows.

The relationship is also used by the AI analysis feature.

---

## AI Job Analysis

The frontend provides an AI-powered job analysis workflow.

The user can analyze a job against a selected resume.

The general flow is:

```text
Job Details
    │
    ▼
Select Resume
    │
    ▼
Request AI Analysis
    │
    ▼
Backend AI Service
    │
    ▼
Gemini
    │
    ▼
Persisted Analysis
    │
    ▼
Frontend
```

The frontend displays analysis information such as:

- Match percentage
- Matching skills
- Missing skills
- Recommendations

AI analysis results are retrieved through the backend API and managed as server state through TanStack React Query.

---

## Calendar and Interview Management

Interview and calendar functionality is organized into dedicated features:

```text
src/features/interviews/
src/features/calendar/
```

Interview functionality includes:

- Interview scheduling
- Interview details
- Interview status
- Interview reminders
- Meeting information

Calendar functionality provides a date-oriented view of relevant job and interview activity.

---

## Profile and Settings

Profile and settings functionality is separated into:

```text
src/features/profile/
src/features/settings/
```

Profile functionality includes user profile information and avatar-related functionality.

Settings contains application and account preferences such as notification preferences and account-related actions.

These features communicate with the backend through the same REST API architecture used throughout the application.

---

## Error Handling

The frontend provides user-facing error handling for API and application failures.

API errors are handled through the application's API communication and feature logic.

The UI can display:

- Validation errors
- Authentication errors
- Authorization errors
- API errors
- Loading failures
- Empty states

Internal backend implementation details should not be exposed directly to users.

The frontend instead presents appropriate user-facing messages.

---

## Loading and Empty States

Application features provide UI states for different stages of server interaction.

Common states include:

```text
Loading
   │
   ▼
Data Loaded
   │
   ├── Data Available
   │
   └── Empty State

Request Failure
   │
   ▼
Error State
```

This keeps the interface predictable while asynchronous data is being loaded or updated.

---

## Responsive Design

The frontend is designed to support different screen sizes.

Tailwind CSS responsive utilities are used to adapt layouts for:

- Desktop
- Tablet
- Smaller screens

Reusable UI components and responsive layouts help maintain consistent behavior across different viewport sizes.

---

## Environment Configuration

Frontend environment configuration uses Vite environment variables.

The primary API configuration is:

```env
VITE_API_URL=
```

Environment-specific values should be supplied through the appropriate deployment environment.

Production configuration must not contain hardcoded secrets.

The frontend only exposes variables intended to be available to the browser.

---

## Development Tooling

The frontend uses:

- Vite for development and production builds
- ESLint for code quality
- TypeScript for type checking
- Vitest for automated tests
- React Testing Library for component testing

React Query Devtools are enabled only during development:

```text
Development
    │
    └── React Query Devtools

Production
    │
    └── Devtools disabled
```

This prevents development tooling from being unnecessarily included in the production user experience.

---

## Automated Testing

The frontend has automated tests implemented using Vitest and React Testing Library.

Current local frontend test status:

```text
57 test files
147 tests
All tests passing
```

Tests are used to verify frontend behavior including:

- Components
- Hooks
- Feature behavior
- Forms
- Validation
- Authentication behavior
- API-related logic
- Utility behavior

The production frontend build also passes successfully.

---

## Continuous Integration

Frontend tests and the production build are executed through GitHub Actions.

The frontend CI flow is:

```text
Checkout Repository
       │
       ▼
Install Dependencies
       │
       ▼
Run Frontend Tests
       │
       ▼
Build Frontend
```

The workflow runs on:

- Pushes to `main`
- Pull requests targeting `main`

The frontend CI pipeline currently validates tests and production builds.

---

## Production Build

The frontend production build is generated using:

```bash
npm run build
```

The build process performs TypeScript compilation followed by the Vite production build.

The resulting frontend can be deployed to a static hosting platform such as Vercel.

The current project has successfully completed production build verification.

The Vite build may report bundle-size warnings for large JavaScript chunks; these are optimization opportunities rather than build failures.

---

## Frontend Data Flow

The overall frontend data flow is:

```text
User Interaction
       │
       ▼
React Component
       │
       ▼
Feature Logic
       │
       ├───────────────┐
       │               │
       ▼               ▼
TanStack Query       Zustand
       │               │
       ▼               ▼
Axios / API        Client State
       │
       ▼
Express REST API
       │
       ▼
Backend Services
       │
       ▼
PostgreSQL / External Services
```

TanStack React Query manages data received from the backend while Zustand manages client-side application state.

---

## State Management Strategy

JobTrack AI intentionally separates server state from client state.

### Server State

TanStack React Query manages state originating from the backend, including:

- Jobs
- Job activities
- Interviews
- Resumes
- Notifications
- Dashboard data
- Analytics
- AI analysis
- Profile data
- Settings-related server data

React Query provides:

- Caching
- Query invalidation
- Refetching
- Loading state management
- Error state management
- Server-state synchronization

### Client State

Zustand manages client-side application state that does not belong in server-state caching.

The current primary example is authentication-related state.

This separation reduces unnecessary global state and avoids duplicating backend data in Zustand.

---

## Architecture Principles

The frontend architecture follows these principles:

### 1. Feature-Based Organization

Application functionality is grouped by business domain.

### 2. Separation of Concerns

UI, routing, server state, client state, API communication, and feature logic are kept in their appropriate layers.

### 3. Server/Client State Separation

TanStack React Query manages server state while Zustand manages client-side application state.

### 4. Reusable Components

Common UI functionality is centralized in shared components.

### 5. Type Safety

TypeScript is used throughout the frontend to improve maintainability and reduce runtime errors.

### 6. Schema-Based Validation

Zod and React Hook Form provide structured and type-safe form validation.

### 7. Responsive Design

The UI is designed to work across different screen sizes.

### 8. Environment-Based Configuration

Environment-specific API configuration is separated from application source code.

### 9. Testability

Features and reusable components are structured so that frontend behavior can be tested independently.

### 10. Production Readiness

The frontend has completed its core functionality, automated testing, CI validation, production build verification, and development-tooling hardening.

Production deployment infrastructure remains part of the deployment phase.

---

## Current Frontend Status

The frontend core application is implemented and operational.

Completed areas include:

- Authentication
- Protected routing
- Dashboard
- Jobs
- Job board
- Job activity
- Interviews
- Calendar
- Follow-ups
- Resumes
- Resume-to-job integration
- Notifications
- Analytics
- Profile
- Settings
- AI job analysis
- Cloud file storage integration
- Automated testing
- Production build verification
- GitHub Actions CI

The remaining work is primarily related to production infrastructure and deployment rather than the core frontend architecture.
