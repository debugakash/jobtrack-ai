# Frontend Architecture

## Tech Stack

The JobTrack AI frontend is built using:

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

The frontend follows a feature-based architecture to keep application functionality organized by domain.

---

## Project Structure

```text
client/
├── src/
│   ├── app/
│   │   ├── layouts/
│   │   ├── providers/
│   │   │   └── query-provider.tsx
│   │   └── router/
│   │
│   ├── assets/
│   ├── components/
│   ├── config/
│   ├── constants/
│   ├── features/
│   │   ├── activity/
│   │   ├── analytics/
│   │   ├── auth/
│   │   ├── board/
│   │   ├── calendar/
│   │   ├── dashboard/
│   │   ├── interviews/
│   │   ├── jobs/
│   │   ├── notifications/
│   │   ├── profile/
│   │   ├── resumes/
│   │   └── settings/
│   │
│   ├── hooks/
│   ├── lib/
│   ├── pages/
│   ├── routes/
│   │   ├── index.tsx
│   │   ├── protected-route.tsx
│   │   └── public-route.tsx
│   │
│   ├── services/
│   ├── stores/
│   │   └── auth-store.ts
│   │
│   ├── styles/
│   ├── types/
│   ├── utils/
│   ├── App.css
│   ├── App.tsx
│   ├── index.css
│   └── main.tsx
```

Some directories are currently empty and are reserved for future application functionality.

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

Each feature represents a specific area of the application.

This structure helps keep related UI components, hooks, forms, schemas, and feature-specific logic grouped together rather than organizing the entire application by technical type.

For example:

```text
features/
└── jobs/
    ├── components/
    ├── hooks/
    ├── schemas/
    └── ...
```

The exact contents of individual feature directories may evolve as the application grows.

---

## Application Layer

The `app/` directory contains application-level configuration and providers.

```text
app/
├── layouts/
├── providers/
│   └── query-provider.tsx
└── router/
```

Application-wide concerns such as providers, layouts, and routing configuration are separated from individual business features.

---

## React Query

The application uses **TanStack React Query** for server-state management.

The Query Client is configured through:

```text
src/app/providers/query-provider.tsx
```

React Query is responsible for concerns such as:

- Fetching server data
- Caching
- Query invalidation
- Refetching
- Loading states
- Error states
- Synchronizing server data with the UI

This separates server-state management from local client-state management.

---

## Zustand

The application uses **Zustand** for client-side application state.

The authentication store is located at:

```text
src/stores/auth-store.ts
```

Zustand is used for state that needs to be accessed across components without relying on React prop drilling.

The current store structure includes authentication-related state.

---

## Routing

Application routing is implemented using **React Router**.

The route configuration is located at:

```text
src/routes/index.tsx
```

Route access is separated into public and protected routes.

```text
routes/
├── index.tsx
├── protected-route.tsx
└── public-route.tsx
```

### Public Routes

Public routes are intended for pages that do not require an authenticated user.

Examples include authentication-related pages such as:

- Login
- Registration
- Password recovery
- Password reset

### Protected Routes

Protected routes require the user to be authenticated before the associated page can be accessed.

The `protected-route.tsx` component is responsible for enforcing authenticated access.

---

## API Communication

The frontend communicates with the backend through HTTP APIs.

Axios is included as the HTTP client dependency.

The backend API is exposed under the `/api` prefix.

Example:

```text
Frontend
   │
   ▼
Axios
   │
   ▼
Express REST API
   │
   ▼
Services
   │
   ▼
PostgreSQL
```

The `services/` directory is reserved for API communication and related service-layer functionality.

It is currently empty and can be expanded as the frontend API layer is organized.

---

## Forms and Validation

The frontend uses:

- React Hook Form for form state and submission handling
- Zod for schema-based validation
- `@hookform/resolvers` for integrating Zod validation with React Hook Form

This approach allows form validation rules to be defined separately from UI components while maintaining TypeScript type safety.

---

## UI Architecture

The application uses a combination of reusable UI components and feature-specific components.

Shared components are placed under:

```text
src/components/
```

Feature-specific components are placed inside their respective feature directories:

```text
src/features/<feature>/
```

This allows commonly reused UI elements to remain independent from business-specific functionality.

---

## Styling

The frontend uses Tailwind CSS together with shadcn/ui and Radix UI components.

Global styling is handled through:

```text
src/index.css
```

Additional application styling is available through:

```text
src/App.css
```

The `styles/` directory is reserved for additional styling organization and is currently empty.

---

## Data Visualization

The application uses Recharts for dashboard and analytics visualizations.

Charts are used to represent job-search metrics such as:

- Application statistics
- Status distribution
- Monthly applications
- Company-level statistics
- Analytics metrics

---

## Drag and Drop

The application uses `dnd-kit` for drag-and-drop functionality.

It supports interactive interfaces such as the job board where jobs can be organized across different application statuses.

---

## Date Handling

The application uses `date-fns` for date manipulation and formatting.

Date-related functionality is used throughout areas such as:

- Job applications
- Follow-ups
- Interviews
- Calendar
- Analytics
- Dashboard statistics

---

## Notifications

The frontend uses Sonner for toast-style user notifications.

These notifications provide immediate feedback for actions such as:

- Successful updates
- Successful creation or deletion
- Validation failures
- API errors
- Other user actions

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

The general startup flow is:

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
Pages
   │
   ▼
Feature Components
```

---

## State Management Strategy

JobTrack AI separates state based on its responsibility.

```text
                    Frontend State
                         │
              ┌──────────┴──────────┐
              │                     │
       Server State            Client State
              │                     │
              ▼                     ▼
     TanStack React Query         Zustand
              │                     │
              ▼                     ▼
        Backend API          Application State
```

### Server State

TanStack React Query handles data originating from the backend API, including:

- Jobs
- Interviews
- Resumes
- Notifications
- Dashboard data
- Analytics
- AI analysis results

### Client State

Zustand handles client-side application state such as authentication-related state.

This separation reduces unnecessary global state and keeps server data synchronized through React Query.

---

## Architecture Principles

The frontend architecture follows these principles:

1. **Feature-based organization**
   Application functionality is grouped by business domain.

2. **Separation of concerns**
   UI, routing, state management, API communication, and business features are kept separate.

3. **Server/client state separation**
   TanStack React Query handles server state while Zustand handles client-side state.

4. **Reusable components**
   Common UI functionality is centralized in shared components.

5. **Type safety**
   TypeScript is used throughout the frontend.

6. **Schema-based validation**
   Zod and React Hook Form provide structured form validation.

7. **Scalable structure**
   Empty directories such as `services/`, `styles/`, `types/`, and `utils/` are retained as extension points for future functionality.
