# Backend Architecture

## Overview

JobTrack AI uses a layered backend architecture designed to separate HTTP handling, business logic, data access, validation, authentication, and infrastructure concerns.

The backend is built with:

- Node.js
- Express.js
- TypeScript
- PostgreSQL
- Prisma ORM
- Zod
- JWT Authentication
- bcrypt
- Multer
- Supabase Storage
- Google Gemini API

---

# Tech Stack

| Technology       | Purpose                        |
| ---------------- | ------------------------------ |
| Node.js          | Backend runtime                |
| Express.js       | REST API framework             |
| TypeScript       | Type safety                    |
| PostgreSQL       | Primary relational database    |
| Prisma           | ORM and database access        |
| Zod              | Request/data validation        |
| JWT              | Authentication                 |
| bcrypt           | Password hashing               |
| Multer           | Multipart file upload handling |
| Supabase Storage | Resume and avatar file storage |
| Google Gemini    | AI job analysis                |

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
   └── Error Handling
   │
   ▼
Controller
   │
   ▼
Service
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

This separation keeps HTTP concerns, business logic, and database access independent from each other.

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
│   ├── services/
│   ├── utils/
│   ├── validators/
│   └── index.ts
│
├── prisma.config.ts
├── package.json
└── tsconfig.json
```

---

# Routes

Routes define the REST API endpoints and connect them to middleware and controllers.

Responsibilities include:

- Defining HTTP methods
- Defining API paths
- Applying authentication middleware
- Applying validation middleware
- Connecting requests to controllers

Examples include:

```text
/auth
/jobs
/interviews
/resumes
/notifications
/profile
/analytics
/ai
```

---

# Middleware

Middleware handles cross-cutting application concerns.

Examples include:

- JWT authentication
- Request validation
- File upload processing
- Error handling
- Request preprocessing

Protected routes use authentication middleware to identify the current user.

---

# Controllers

Controllers handle HTTP-specific responsibilities.

They are responsible for:

- Reading request parameters
- Reading request bodies
- Calling application services
- Returning HTTP responses

Controllers should remain thin and delegate business logic to services.

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

---

# Repositories

Repositories isolate database access from business logic.

Repositories are responsible for:

- Creating database records
- Reading database records
- Updating database records
- Deleting database records
- Executing Prisma queries
- Loading related entities

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

---

# Validation

Zod is used to validate incoming application data.

Validation is applied to areas such as:

- User registration
- Login
- Password changes
- Password reset
- Job creation
- Job updates
- Profile updates
- Notification preferences
- Other API inputs

Invalid data is rejected before reaching business logic.

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

Reset tokens also contain:

- Expiration time
- Used timestamp
- User association

---

# Prisma Configuration

The project uses **Prisma 7** with PostgreSQL.

The Prisma setup uses:

- `@prisma/client`
- `@prisma/adapter-pg`
- `pg`

The database connection is configured through:

```text
prisma.config.ts
```

The application uses the PostgreSQL adapter rather than relying on the older direct:

```ts
new PrismaClient();
```

configuration without an adapter.

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

---

# Job Architecture

A `Job` represents a job application tracked by a user.

A job contains information such as:

- Company
- Job title
- Description
- Location
- Job type
- Work mode
- Salary range
- Status
- Source
- Job URL
- Notes
- Application date

A job belongs to one user.

A job can also have:

- One optional resume association
- One optional AI analysis
- Multiple activities
- Multiple interviews
- Multiple notifications
- Follow-up information

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

A future normalized `Company` entity could be introduced if the application later requires company-level analytics or reusable company records.

---

# Job Activity Architecture

Job history is represented using the `JobActivity` model.

Activities can represent events such as:

- Job Created
- Status Changed
- Note
- Follow-up
- Interview
- Resume
- Offer
- Rejected
- Other

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

- Round
- Scheduled date/time
- Interviewer
- Meeting link
- Notes
- Completion state

Interview events can also be represented in the job activity timeline.

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

- Original filename
- Stored filename
- File path
- MIME type
- File size
- Label
- Default state

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

- Title
- Message
- Type
- Read/unread state
- Action URL
- Reminder date
- User association
- Optional job association

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

The `JobAiAnalysis` model stores:

- Match score
- Matching skills
- Missing skills
- Suggestions
- AI provider
- AI model
- Job association
- Optional resume association

A job can have one AI analysis because `jobId` is unique.

---

# AI Persistence

AI analysis results are persisted in PostgreSQL.

This means the application does not need to request a new AI analysis every time the user opens the job details page.

The stored analysis can be retrieved and displayed later.

---

# Email Architecture

Email functionality is separated into dedicated email-related services.

Email functionality supports application workflows such as:

- Password reset
- Follow-up reminders
- Interview reminders
- Other notification emails

Business logic can request email delivery without directly depending on the underlying email implementation.

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

This keeps API error responses consistent across controllers.

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

---

# Design Principles

## Separation of Concerns

HTTP handling, business logic, database access, and infrastructure are separated.

## Type Safety

TypeScript is used throughout the backend.

## Validation

Zod validates external input.

## Security

Passwords are hashed using bcrypt and authentication is handled through JWT.

## Database Integrity

Prisma relations and foreign keys maintain relationships between entities.

## Infrastructure Abstraction

Storage and other external services are isolated behind dedicated service layers.

## Maintainability

Controllers remain focused on HTTP concerns while services contain application logic.

## Testability

The layered architecture makes individual services and repositories easier to test independently.
