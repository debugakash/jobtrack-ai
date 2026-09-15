# Backend Architecture

## Overview

JobTrack AI uses a layered backend architecture designed to separate HTTP handling, business logic, data access, validation, authentication, background processing, and infrastructure concerns.

The backend is built with:

* Node.js
* Express.js
* TypeScript
* PostgreSQL
* Prisma ORM
* Zod
* JWT Authentication
* bcrypt
* Multer
* Supabase Storage
* Google Gemini API
* Resend
* node-cron

The architecture follows a Controller → Service → Repository → Prisma → PostgreSQL flow for application data access.

External infrastructure such as storage, email, AI processing, and scheduled notifications is isolated behind dedicated services.

---

# Tech Stack

| Technology       | Purpose                           |
| ---------------- | --------------------------------- |
| Node.js          | Backend runtime                   |
| Express.js       | REST API framework                |
| TypeScript       | Type safety                       |
| PostgreSQL       | Primary relational database       |
| Prisma           | ORM and database access           |
| Zod              | Request/data validation           |
| JWT              | Authentication                    |
| bcrypt           | Password hashing                  |
| Multer           | Multipart file upload handling    |
| Supabase Storage | Resume and avatar file storage    |
| Google Gemini    | AI job analysis                   |
| Resend           | Transactional email delivery      |
| node-cron        | Scheduled notification processing |

---

# Architecture

The backend follows a layered architecture:

```text
Client
   │
   ▼
Express Route
   │
   ▼
Middleware
   │
   ├── Authentication
   ├── Validation
   ├── Rate Limiting
   ├── File Upload Processing
   └── Error Handling
   │
   ▼
Controller
   │
   ▼
Service
   │
   ├── Business Logic
   ├── Storage
   ├── Email
   ├── AI
   └── Scheduling
   │
   ▼
Repository
   │
   ▼
Prisma
   │
   ▼
PostgreSQL
```

This separation keeps HTTP concerns, business logic, database access, and infrastructure integrations independent from each other.

---

# Project Structure

```text
server/
├── prisma/
│   ├── schema.prisma
│   └── migrations/
│
├── src/
│   ├── config/
│   ├── controllers/
│   ├── errors/
│   ├── middleware/
│   ├── repositories/
│   ├── routes/
│   ├── schedulers/
│   ├── services/
│   ├── utils/
│   ├── validators/
│   ├── app.ts
│   └── index.ts
│
├── prisma.config.ts
├── package.json
└── tsconfig.json
```

### Main Responsibilities

| Directory       | Responsibility                                                |
| --------------- | ------------------------------------------------------------- |
| `config/`       | Environment, database, and application configuration          |
| `controllers/`  | HTTP request/response handling                                |
| `errors/`       | Application-specific error classes                            |
| `middleware/`   | Authentication, validation, rate limiting, and error handling |
| `repositories/` | Database access through Prisma                                |
| `routes/`       | REST API route definitions                                    |
| `schedulers/`   | Scheduled background tasks                                    |
| `services/`     | Business logic and infrastructure integrations                |
| `utils/`        | Shared backend utility functions                              |
| `validators/`   | Zod request validation schemas                                |

---

# Application Entry Points

The Express application is separated into application configuration and server startup.

```text
src/app.ts
src/index.ts
```

`app.ts` creates and configures the Express application, including:

* Security middleware
* CORS
* JSON parsing
* API routes
* Error handling

`index.ts` starts the HTTP server and manages application lifecycle concerns such as:

* Notification scheduler startup
* Graceful shutdown
* Prisma disconnection

This separation makes the Express application easier to test without automatically starting the HTTP server.

---

# Routes

Routes define the REST API endpoints and connect them to middleware and controllers.

Responsibilities include:

* Defining HTTP methods
* Defining API paths
* Applying authentication middleware
* Applying validation middleware
* Applying rate limiting where required
* Applying upload middleware where required
* Connecting requests to controllers

Examples include:

```text
/auth
/users
/jobs
/interviews
/resumes
/ai
```

Additional application routes are mounted under:

```text
/dashboard
/analytics
/notifications
```

---

# Middleware

Middleware handles cross-cutting application concerns.

The backend currently uses middleware for:

* JWT authentication
* Request validation
* Rate limiting
* File upload processing
* Error handling
* Request preprocessing

Protected routes use authentication middleware to identify the current user.

---

# Authentication Middleware

Protected requests provide a JWT access token using:

```http
Authorization: Bearer <access-token>
```

The authentication middleware:

1. Reads the authorization header.
2. Extracts the bearer token.
3. Verifies the JWT.
4. Extracts the authenticated user's ID.
5. Attaches the authenticated user information to the request.
6. Allows the request to continue to the controller.

The authenticated user ID is available through:

```text
req.user.userId
```

---

# Rate Limiting

Authentication-sensitive endpoints use request rate limiting to reduce abuse and brute-force attempts.

Current limits include:

| Endpoint Group |       Limit | Window     |
| -------------- | ----------: | ---------- |
| Authentication | 10 requests | 15 minutes |
| Password Reset |  5 requests | 15 minutes |

When the configured limit is exceeded, the API returns:

```text
429 Too Many Requests
```

Rate limiting is implemented at the route level rather than globally so that normal authenticated application traffic is not unnecessarily restricted.

---

# Controllers

Controllers handle HTTP-specific responsibilities.

They are responsible for:

* Reading request parameters
* Reading request bodies
* Reading authenticated user information
* Calling application services
* Returning HTTP responses

Controllers should remain thin and delegate business logic to services.

Typical flow:

```text
HTTP Request
     │
     ▼
Controller
     │
     ▼
Service
     │
     ▼
Response
```

---

# Services

Services contain the application's business logic.

Examples include:

```text
auth.service.ts
user.service.ts
job.service.ts
interview.service.ts
resume.service.ts
notification.service.ts
email.service.ts
storage.service.ts
AI services
```

Services coordinate repositories and external infrastructure where necessary.

Examples:

* Authentication service handles login and password workflows.
* Job service manages job application business rules.
* Resume service coordinates resume metadata and file storage.
* Notification service manages application notifications.
* Email service handles transactional email delivery.
* Storage service abstracts cloud file storage.
* AI services coordinate resume/job analysis.

---

# Repositories

Repositories isolate database access from business logic.

Repositories are responsible for:

* Creating database records
* Reading database records
* Updating database records
* Deleting database records
* Executing Prisma queries
* Loading related entities

The general data-access flow is:

```text
Service
   ↓
Repository
   ↓
Prisma
   ↓
PostgreSQL
```

This separation allows services to focus on business rules without directly coupling application logic to database queries.

---

# Validation

Zod is used to validate incoming application data.

Validation is applied to areas such as:

* User registration
* Login
* Password changes
* Password reset
* Job creation
* Job updates
* Job query parameters
* Profile updates
* Notification preferences
* Resume metadata
* Interview creation
* Interview updates
* Other API inputs

Invalid data is rejected before reaching business logic.

The validation layer helps maintain consistent request contracts and type-safe application behavior.

---

# Authentication

JobTrack AI uses JWT-based authentication.

The login flow is:

```text
User Credentials
       │
       ▼
Validate Input
       │
       ▼
Find User
       │
       ▼
Compare Password
       │
       ▼
Generate JWT
       │
       ▼
Return Authentication Response
```

Protected requests provide the JWT access token.

The authentication middleware validates the token and associates the authenticated user with the request.

---

# Password Security

User passwords are never stored as plain text.

The application uses bcrypt for password hashing.

```text
Plain Password
      │
      ▼
    bcrypt
      │
      ▼
Password Hash
      │
      ▼
PostgreSQL
```

Password reset tokens are also handled securely.

The database stores the hashed reset token rather than the raw token.

Reset tokens contain:

* Expiration time
* Used timestamp
* User association

This allows reset tokens to be temporary and single-use.

---

# Environment Configuration

Runtime configuration is centralized through the environment configuration layer.

The backend validates required environment variables during startup.

Configuration includes values for areas such as:

* Server port
* Node environment
* Database connection
* JWT configuration
* Frontend origin
* Email provider
* AI providers
* Supabase Storage

Application code should access validated configuration through the configuration layer rather than reading environment variables throughout the codebase.

Sensitive production credentials are provided through environment configuration and are not committed to source control.

---

# Prisma Configuration

The project uses Prisma 7 with PostgreSQL.

The Prisma setup uses:

* `@prisma/client`
* `@prisma/adapter-pg`
* `pg`

The database connection is configured through:

```text
prisma.config.ts
```

The application uses the PostgreSQL adapter rather than relying on the older direct:

```ts
new PrismaClient();
```

configuration without an adapter.

Database schema changes are managed through Prisma migrations.

The current project contains the migration history required to recreate the application database schema.

---

# Database Architecture

PostgreSQL is the primary application database.

The database stores structured relational data including:

```text
User
PasswordResetToken
Job
JobActivity
Interview
Notification
NotificationPreference
Resume
JobAiAnalysis
```

The high-level database flow is:

```text
Application
     │
     ▼
Repository
     │
     ▼
Prisma
     │
     ▼
PostgreSQL
```

Prisma relations and foreign keys maintain relationships between entities.

---

# Job Architecture

A `Job` represents a job application tracked by a user.

A job contains information such as:

* Company
* Job title
* Description
* Location
* Job type
* Work mode
* Salary range
* Status
* Source
* Job URL
* Notes
* Application date
* Follow-up information

A job belongs to one user.

A job can also have:

* One optional resume association
* One optional AI analysis
* Multiple activities
* Multiple interviews
* Multiple notifications
* Follow-up information

---

# Company Representation

There is currently **no separate `Company` model** in the database.

Company information is stored directly on the `Job` model:

```text
Job.company
```

Therefore:

```text
User
 │
 └── Job
       └── company: String
```

A future normalized `Company` entity could be introduced if the application later requires reusable company records or more advanced company-level analytics.

---

# Job Activity Architecture

Job history is represented using the `JobActivity` model.

Activities can represent events such as:

* Job Created
* Status Changed
* Note
* Follow-up
* Interview
* Resume
* Offer
* Rejected
* Other

The relationship is:

```text
Job (1)
 │
 └──── (*) JobActivity
```

This provides the application's activity timeline.

---

# Interview Architecture

Interviews belong directly to jobs.

```text
Job (1)
 │
 └──── (*) Interview
```

An interview contains information such as:

* Round
* Scheduled date/time
* Interviewer
* Meeting link
* Notes
* Completion state

Interview events can also be represented in the job activity timeline.

Interview reminders can be processed by the notification scheduler.

---

# Resume Architecture

Resumes belong to users.

```text
User (1)
 │
 └──── (*) Resume
```

A resume can optionally be associated with multiple jobs:

```text
Resume (1)
 │
 └──── (*) Job
```

The relationship is implemented through:

```text
Job.resumeId
```

The resume record stores metadata such as:

* Original filename
* Stored filename
* File path/storage path
* MIME type
* File size
* Label
* Default state

The actual binary file is stored separately in Supabase Storage.

---

# Resume Storage Flow

Resume uploads use Multer memory storage.

```text
Resume Upload
      │
      ▼
Multer memoryStorage
      │
      ▼
Express File Buffer
      │
      ▼
StorageService
      │
      ▼
SupabaseStorageService
      │
      ▼
Supabase Storage
```

The database stores resume metadata and the storage path, while the actual file is kept in cloud storage.

The application does not serve resume files from a local `/uploads` directory.

---

# Upload Security

File uploads are restricted by file type and size.

Current restrictions:

| File   | Maximum Size | Supported Formats |
| ------ | -----------: | ----------------- |
| Resume |         5 MB | PDF, DOC, DOCX    |
| Avatar |         2 MB | JPG, PNG, WEBP    |

Uploads are processed through Multer and passed to the storage abstraction.

This prevents unsupported or unnecessarily large files from being stored.

---

# Avatar Storage

User avatars are stored separately from the relational database.

The database stores the avatar storage reference:

```text
User.avatar
```

The actual image is stored in Supabase Storage.

The application can generate secure signed URLs when the avatar needs to be displayed.

---

# Storage Abstraction

File storage is accessed through a storage abstraction rather than directly from application features.

The general architecture is:

```text
Application Service
       │
       ▼
StorageService
       │
       ▼
SupabaseStorageService
       │
       ▼
Supabase Storage
```

This abstraction keeps application logic independent of the specific storage provider.

It also makes it possible to replace the underlying storage implementation in the future without rewriting feature-level business logic.

---

# Notification Architecture

Notifications belong to users and can optionally be associated with a job.

```text
User (1)
 │
 └──── (*) Notification
                │
                └──── optional Job
```

Notification types currently include:

```text
FOLLOW_UP
INTERVIEW
JOB_STATUS
SYSTEM
```

Notifications support:

* Title
* Message
* Type
* Read/unread state
* Action URL
* Reminder date
* User association
* Optional job association

---

# Notification Preferences

Users can configure notification preferences for supported notification channels and reminder types.

Current preference areas include:

* Email Notifications
* Interview Reminders
* Follow-up Reminders

These preferences are stored in the database and used when notification workflows are processed.

---

# Follow-up Architecture

Follow-up information is currently stored directly on the `Job` model.

```text
Job
├── followUpDate
└── followUpDone
```

This allows the application to identify upcoming and completed follow-ups.

The notification system can use this information to generate reminders.

---

# Notification Scheduler

Scheduled notification processing is implemented using `node-cron`.

The scheduler is responsible for periodically processing time-based notification workflows such as:

* Follow-up reminders
* Interview reminders
* Related email notifications

The architecture is:

```text
node-cron
    │
    ▼
Notification Scheduler
    │
    ▼
Notification Service
    │
    ├── In-App Notification
    │
    └── Email Service
             │
             ▼
           Resend
```

The scheduler is started when the backend server starts.

It is explicitly stopped during graceful server shutdown to prevent scheduled jobs from continuing after the application begins shutting down.

---

# Email Architecture

Email functionality is separated into dedicated email-related services.

The email layer supports workflows such as:

* Password reset
* Follow-up reminders
* Interview reminders
* Other application notification emails

The application uses Resend as the email delivery provider.

Business logic can request email delivery without directly depending on the underlying email provider implementation.

---

# AI Architecture

AI analysis compares a job with a selected resume.

The high-level flow is:

```text
Job
 │
 ├── Job Description
 │
 └── Resume
       │
       ▼
Resume Text Extraction
       │
       ▼
AI Service
       │
       ▼
Google Gemini
       │
       ▼
AI Analysis
       │
       ▼
PostgreSQL
```

The `JobAiAnalysis` model stores information such as:

* Match score
* Matching skills
* Missing skills
* Suggestions
* AI provider
* AI model
* Job association
* Optional resume association

A job can have one persisted AI analysis.

---

# AI Persistence

AI analysis results are persisted in PostgreSQL.

This means the application does not need to request a new AI analysis every time the user opens the job details page.

The stored analysis can be retrieved and displayed later.

When a user requests a new analysis, the existing analysis can be replaced or updated according to the service workflow.

---

# Security Architecture

The backend includes several production-hardening measures.

## Helmet

Helmet is used to apply common HTTP security headers.

## CORS

CORS is restricted to configured frontend origins.

Development allows the configured frontend URL and the Vite preview origin where appropriate.

Production uses the configured production frontend origin.

## Request Body Limit

JSON request bodies are limited to:

```text
1 MB
```

This prevents unnecessarily large JSON payloads from reaching application processing.

## Rate Limiting

Authentication and password-reset routes use dedicated rate limiters.

## Generic Error Responses

Unexpected internal errors are handled centrally so that internal implementation details are not exposed to API consumers.

## Upload Restrictions

Resume and avatar uploads are restricted by MIME type and file size.

---

# Error Handling

The backend uses centralized error handling.

Application errors can be represented using custom error classes such as:

```text
BadRequestError
UnauthorizedError
ForbiddenError
NotFoundError
ConflictError
```

The central error middleware converts application errors into appropriate HTTP responses.

Unexpected errors are handled without exposing internal implementation details to API consumers.

This keeps error behavior consistent across controllers.

---

# Database Cascade Behavior

The Prisma schema uses relational delete behavior to maintain data consistency.

For example:

```text
User
 ├── Jobs
 ├── Resumes
 ├── Notifications
 └── PasswordResetTokens
```

These related records use cascading deletion where configured.

Similarly:

```text
Job
 ├── JobActivities
 ├── Interviews
 └── Notifications
```

are configured to be removed when their parent job is deleted where the schema specifies `onDelete: Cascade`.

Resume associations use `SetNull` where appropriate so deleting a resume does not delete the associated job.

The exact relationship behavior is defined by the Prisma schema.

---

# Account Deletion

Account deletion is handled through the authentication/account service workflow.

The process removes the authenticated user's account and associated application data according to the configured Prisma relationships and storage cleanup logic.

The architecture ensures that account deletion is not implemented only as a single user-record deletion when related resources also require cleanup.

---

# Graceful Shutdown

The backend implements graceful shutdown handling.

When the process receives `SIGINT` or `SIGTERM`, the server:

```text
Shutdown Signal
      │
      ▼
Stop Notification Scheduler
      │
      ▼
Stop Accepting New Connections
      │
      ▼
Close HTTP Server
      │
      ▼
Disconnect Prisma
      │
      ▼
Process Exit
```

This helps prevent active resources from being abandoned during application shutdown.

---

# Application Startup

The server startup flow is:

```text
Application Start
      │
      ▼
Load Environment Configuration
      │
      ▼
Initialize Express Application
      │
      ▼
Start HTTP Server
      │
      ▼
Start Notification Scheduler
```

The application validates required configuration before relying on runtime services.

---

# Testing Architecture

The backend uses Vitest for automated testing.

Tests cover backend application behavior across areas such as:

* Services
* Repositories
* Validators
* Middleware
* Authentication behavior
* Business logic
* Error handling

The current backend test suite contains:

```text
23 test files
281 tests
```

All current backend tests pass locally.

The test suite is executed using:

```bash
npm run test:run
```

The backend production TypeScript build is also verified using:

```bash
npm run build
```

---

# Continuous Integration

Backend verification is included in GitHub Actions CI.

The backend CI workflow performs:

```text
Checkout
   │
   ▼
Install Dependencies
   │
   ▼
Generate Prisma Client
   │
   ▼
Run Automated Tests
   │
   ▼
Build TypeScript Application
```

Prisma Client generation is performed explicitly in CI because a clean CI environment does not contain a previously generated Prisma Client.

The CI workflow runs for:

* Pushes to `main`
* Pull requests targeting `main`

Successful CI acts as a quality gate before changes are considered ready for the next stage.

---

# Production Architecture

The intended production architecture separates the frontend, backend, database, storage, email, and AI infrastructure:

```text
React Frontend
     │
     ▼
Node.js / Express API
     │
     ├──────────────► PostgreSQL
     │
     ├──────────────► Supabase Storage
     │
     ├──────────────► Resend
     │
     └──────────────► Google Gemini
```

GitHub Actions provides automated verification of application changes.

Production hosting and infrastructure configuration are maintained separately from the application source code.

---

# Design Principles

## Separation of Concerns

HTTP handling, business logic, database access, and infrastructure are separated.

## Type Safety

TypeScript is used throughout the backend.

## Validation

Zod validates external input before it reaches business logic.

## Security

Passwords are hashed using bcrypt and authentication is handled through JWT.

Security middleware provides CORS restrictions, security headers, rate limiting, request limits, and upload validation.

## Database Integrity

Prisma relations and foreign keys maintain relationships between entities.

## Infrastructure Abstraction

Storage, email, AI processing, and scheduled processing are isolated behind dedicated services where appropriate.

## Maintainability

Controllers remain focused on HTTP concerns while services contain application logic.

## Testability

The layered architecture makes individual services, repositories, validators, and middleware easier to test independently.

## Production Readiness

The backend includes environment validation, security hardening, graceful shutdown, automated testing, production build verification, and CI verification.

Production database infrastructure, hosting, deployment automation, monitoring, and other environment-specific infrastructure remain part of the production deployment phase.
