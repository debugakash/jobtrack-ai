# JobTrack AI Database Schema

## Overview

JobTrack AI uses **PostgreSQL** as its primary relational database and **Prisma ORM** for schema management and type-safe database access.

The current Prisma schema contains:

- User
- PasswordResetToken
- Job
- JobActivity
- Interview
- Notification
- Resume
- JobAiAnalysis

The application does not currently use separate database models for Company, Recruiter, Document, or StatusHistory.

---

# Database Architecture

```text
Application
     │
     ▼
Repository
     │
     ▼
Prisma ORM
     │
     ▼
PostgreSQL
```

Binary files use a separate storage architecture:

```text
Application
     │
     ▼
StorageService
     │
     ▼
Supabase Storage
```

---

# User

The `User` model represents an authenticated JobTrack AI user.

### Main fields

```text
id
firstName
lastName
email
passwordHash
avatar
phone
location
headline
bio
linkedinUrl
githubUrl
portfolioUrl
skills
isActive
emailVerified
createdAt
updatedAt
lastLogin
emailNotifications
interviewReminders
followUpReminders
```

### Relationships

```text
User
├── jobs[]
├── resumes[]
├── notifications[]
└── passwordResetTokens[]
```

---

# PasswordResetToken

The `PasswordResetToken` model supports secure password recovery.

### Main fields

```text
id
tokenHash
expiresAt
usedAt
userId
createdAt
```

### Relationship

```text
User (1) ───── (*) PasswordResetToken
```

### Indexes

The schema indexes:

```text
userId
expiresAt
```

The token hash is unique.

The raw reset token is not stored.

---

# Job

The `Job` model represents a job application.

### Main fields

```text
id
company
jobTitle
description
location
jobType
workMode
salaryMin
salaryMax
status
source
jobUrl
notes
resumeId
followUpDate
followUpDone
appliedAt
createdAt
updatedAt
userId
```

### Relationships

```text
Job
├── user
├── resume?
├── aiAnalysis?
├── activities[]
├── interviews[]
└── notifications[]
```

### Indexes

The schema indexes:

```text
userId
status
company
createdAt
resumeId
```

These indexes support common job-listing and filtering operations.

---

# Company

There is no separate `Company` model.

The company name is stored directly in:

```text
Job.company
```

The current structure is therefore:

```text
Job
└── company: String
```

This keeps the current data model simple and avoids introducing a separate company table until there is a functional requirement for it.

---

# JobActivity

The `JobActivity` model represents the historical timeline of a job application.

### Main fields

```text
id
type
title
description
eventDate
createdAt
jobId
```

### Relationship

```text
Job (1) ───── (*) JobActivity
```

### Activity types

```text
CREATED
STATUS_CHANGED
NOTE
FOLLOW_UP
INTERVIEW
RESUME
OFFER
REJECTED
OTHER
```

### Indexes

```text
jobId
eventDate
```

The `eventDate` index supports chronological activity retrieval.

---

# Interview

The `Interview` model represents an interview associated with a job.

### Main fields

```text
id
round
scheduledAt
interviewerName
meetingLink
notes
completed
createdAt
updatedAt
jobId
```

### Relationship

```text
Job (1) ───── (*) Interview
```

### Indexes

```text
jobId
scheduledAt
```

---

# Notification

The `Notification` model stores user-facing notifications.

### Main fields

```text
id
title
message
type
isRead
actionUrl
reminderDate
createdAt
userId
jobId
```

### Relationships

```text
User (1) ───── (*) Notification

Job (1) ───── (*) Notification
```

The job relationship is optional.

This allows both:

```text
Job-specific notifications
```

and:

```text
System-level notifications
```

### Notification types

```text
FOLLOW_UP
INTERVIEW
JOB_STATUS
SYSTEM
```

### Indexes

```text
userId
jobId
createdAt
```

### Unique Constraint

The schema contains:

```text
@@unique([userId, jobId, type, reminderDate])
```

This helps prevent duplicate notifications for the same user, job, notification type, and reminder date combination.

---

# Resume

The `Resume` model stores resume metadata.

### Main fields

```text
id
originalName
storedName
filePath
mimeType
fileSize
label
isDefault
createdAt
updatedAt
userId
```

### Relationships

```text
User (1) ───── (*) Resume

Resume (1) ───── (*) Job

Resume (1) ───── (*) JobAiAnalysis
```

A resume can be associated with multiple jobs through:

```text
Job.resumeId
```

### Indexes

```text
userId
```

---

# Resume File Storage

The `Resume` database record does not contain the binary file itself.

Instead:

```text
Resume
   │
   ├── Metadata → PostgreSQL
   │
   └── filePath → Supabase Storage
```

The actual resume file is stored in Supabase Storage.

This keeps large binary files separate from relational database data.

---

# JobAiAnalysis

The `JobAiAnalysis` model stores AI-generated analysis for a job.

### Main fields

```text
id
matchScore
matchingSkills
missingSkills
suggestions
provider
model
createdAt
updatedAt
jobId
resumeId
```

### Relationships

```text
Job (1) ───── (0..1) JobAiAnalysis

Resume (1) ───── (*) JobAiAnalysis
```

The `jobId` field is unique, meaning each job can have at most one stored AI analysis.

The `resumeId` relationship is optional.

---

# AI Analysis Data

The AI analysis stores:

```text
matchScore
matchingSkills
missingSkills
suggestions
provider
model
```

Example conceptual structure:

```text
Job AI Analysis
│
├── Match Score
├── Matching Skills
├── Missing Skills
├── Suggestions
├── Provider
└── Model
```

The analysis is persisted so the frontend can retrieve previously generated results.

---

# Enums

The Prisma schema defines the following enums.

## JobStatus

```text
WISHLIST
APPLIED
SCREENING
INTERVIEW
OFFER
REJECTED
ACCEPTED
```

---

## JobType

```text
FULL_TIME
PART_TIME
CONTRACT
INTERN
```

---

## WorkMode

```text
REMOTE
HYBRID
ONSITE
```

---

## JobSource

```text
LINKEDIN
NAUKRI
INDEED
REFERRAL
COMPANY_WEBSITE
OTHER
```

---

## JobActivityType

```text
CREATED
STATUS_CHANGED
NOTE
FOLLOW_UP
INTERVIEW
RESUME
OFFER
REJECTED
OTHER
```

---

## NotificationType

```text
FOLLOW_UP
INTERVIEW
JOB_STATUS
SYSTEM
```

---

# Relationships

The complete high-level relationship structure is:

```text
User
│
├── PasswordResetToken[]
│
├── Job[]
│   │
│   ├── JobActivity[]
│   ├── Interview[]
│   ├── Notification[]
│   ├── Resume?
│   └── JobAiAnalysis?
│
├── Resume[]
│   │
│   ├── Job[]
│   └── JobAiAnalysis[]
│
└── Notification[]
```

---

# Delete Behavior

The Prisma schema uses cascading relationships where appropriate.

## User Deletion

Deleting a user cascades to related:

```text
Jobs
Resumes
Notifications
PasswordResetTokens
```

---

## Job Deletion

Deleting a job cascades to related:

```text
JobActivities
Interviews
Notifications
JobAiAnalysis
```

---

## Resume Deletion

Deleting a resume does not delete associated jobs.

Instead:

```text
Job.resumeId → NULL
```

The same behavior applies to:

```text
JobAiAnalysis.resumeId → NULL
```

when the associated resume is deleted.

---

# Indexing Strategy

The schema currently defines indexes for frequently accessed relationships and query fields.

Important indexes include:

```text
Job.userId
Job.status
Job.company
Job.createdAt
Job.resumeId

JobActivity.jobId
JobActivity.eventDate

Interview.jobId
Interview.scheduledAt

Notification.userId
Notification.jobId
Notification.createdAt

Resume.userId

JobAiAnalysis.jobId
JobAiAnalysis.createdAt

PasswordResetToken.userId
PasswordResetToken.expiresAt
```

These indexes support common operations such as:

- Loading a user's jobs
- Filtering jobs by status
- Searching/sorting job data
- Loading job activities
- Loading interviews
- Loading notifications
- Loading resumes
- Retrieving AI analysis
- Validating password reset tokens

---

# Database vs File Storage

JobTrack AI separates structured data from binary files.

## PostgreSQL

Stores:

```text
Users
Password Reset Tokens
Jobs
Job Activities
Interviews
Notifications
Resume Metadata
AI Analysis
```

## Supabase Storage

Stores:

```text
Resume Files
Profile Avatars
```

Architecture:

```text
                  JobTrack AI
                      │
             ┌────────┴────────┐
             │                 │
             ▼                 ▼
        PostgreSQL       Supabase Storage
             │                 │
             │                 ├── Resume Files
             │                 └── Avatar Files
             │
             ├── Users
             ├── Jobs
             ├── Activities
             ├── Interviews
             ├── Notifications
             ├── Resume Metadata
             └── AI Analysis
```

---

# Prisma

Prisma is responsible for:

- Database schema definition
- Migrations
- Type-safe database queries
- Relationship handling
- Generated Prisma Client

The project uses Prisma 7 with the PostgreSQL adapter.

The Prisma configuration is defined through:

```text
prisma.config.ts
```

---

# Database Design Principles

## PostgreSQL First

PostgreSQL is the primary application database.

## Relational Integrity

Foreign keys and Prisma relations maintain relationships between application entities.

## File Separation

Binary files are stored in Supabase Storage rather than directly inside PostgreSQL.

## Security

Sensitive credentials and password reset information are stored securely.

## Indexing

Frequently queried fields and relationships are indexed.

## Type Safety

Prisma and TypeScript provide type-safe database access.

## Maintainability

Database access is isolated through the backend repository layer.
