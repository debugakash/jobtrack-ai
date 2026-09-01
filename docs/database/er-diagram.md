# JobTrack AI - Entity Relationship Diagram

## Overview

JobTrack AI uses **PostgreSQL + Prisma** as its primary relational database.

The current database consists of the following Prisma models:

- User
- PasswordResetToken
- Job
- JobActivity
- Interview
- Notification
- Resume
- JobAiAnalysis

There are currently no separate Prisma models for:

- Company
- Recruiter
- Document
- StatusHistory

Company information is stored directly on the `Job` model, while job history is represented by `JobActivity`.

---

# Entities

```text
User
├── PasswordResetToken
├── Job
├── Resume
└── Notification

Job
├── JobActivity
├── Interview
├── Notification
├── Resume
└── JobAiAnalysis

Resume
└── JobAiAnalysis
```

---

# Entity Relationships

## User → Job

```text
User (1) ───────── (*) Job
```

A user can create and manage multiple job applications.

Each job belongs to exactly one user.

Relationship:

```text
Job.userId → User.id
```

Delete behavior:

```text
User deleted
    ↓
Related Jobs deleted
```

---

# User → Resume

```text
User (1) ───────── (*) Resume
```

A user can upload multiple resumes.

Each resume belongs to one user.

Relationship:

```text
Resume.userId → User.id
```

---

# User → Notification

```text
User (1) ───────── (*) Notification
```

A user can have multiple notifications.

Each notification belongs to one user.

Relationship:

```text
Notification.userId → User.id
```

---

# User → PasswordResetToken

```text
User (1) ───────── (*) PasswordResetToken
```

A user can have multiple password reset token records over time.

Each reset token belongs to one user.

Relationship:

```text
PasswordResetToken.userId → User.id
```

---

# Job → JobActivity

```text
Job (1) ───────── (*) JobActivity
```

A job can have multiple activities.

Activities provide the historical timeline of important job events.

Examples:

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

Relationship:

```text
JobActivity.jobId → Job.id
```

---

# Job → Interview

```text
Job (1) ───────── (*) Interview
```

A job can have multiple interviews.

Each interview belongs to one job.

Relationship:

```text
Interview.jobId → Job.id
```

---

# Job → Notification

```text
Job (1) ───────── (*) Notification
```

A notification can optionally be associated with a job.

This allows notifications to point the user back to a specific job application.

Relationship:

```text
Notification.jobId → Job.id
```

The relationship is optional because some notifications may be system-level notifications rather than job-specific notifications.

---

# User → Job → Resume

The job-resume relationship is:

```text
User
 │
 ├── Resume
 │      │
 │      └──── (*) Job
 │
 └── Job
```

A job can optionally reference one resume:

```text
Job.resumeId → Resume.id
```

This allows JobTrack AI to track which resume was used for a particular job application.

If the associated resume is deleted, the job's resume association is set to `NULL`.

---

# Job → JobAiAnalysis

```text
Job (1) ───────── (0..1) JobAiAnalysis
```

A job can have zero or one AI analysis.

The relationship is one-to-one because:

```text
JobAiAnalysis.jobId
```

is unique.

Relationship:

```text
JobAiAnalysis.jobId → Job.id
```

Deleting a job deletes its associated AI analysis.

---

# Resume → JobAiAnalysis

```text
Resume (1) ───────── (*) JobAiAnalysis
```

An AI analysis can optionally reference the resume used for the analysis.

Relationship:

```text
JobAiAnalysis.resumeId → Resume.id
```

The relationship is optional because an analysis may exist without an associated resume reference.

If the resume is deleted, the AI analysis remains but its `resumeId` is set to `NULL`.

---

# Password Reset Token

Password reset tokens are independent child records of a user.

```text
User
 │
 └──── (*) PasswordResetToken
```

The token record stores:

- Token hash
- Expiration
- Used timestamp
- User association
- Creation timestamp

The raw password reset token is not stored in the database.

---

# Company Representation

There is no separate `Company` entity.

Instead, the company name is stored directly on each job:

```text
Job.company
```

Therefore the current structure is:

```text
User
 │
 └── Job
      └── company: String
```

This means two jobs with the same company name are currently independent job records.

---

# Recruiter Representation

There is currently no separate `Recruiter` entity in the Prisma schema.

Recruiter information is therefore not represented by a dedicated relational model.

If recruiter management becomes a future feature, a dedicated `Recruiter` model could be introduced.

---

# Document Representation

There is currently no generic `Document` entity.

Resume files are represented by the `Resume` model.

The actual binary resume file is stored in Supabase Storage while its metadata is stored in PostgreSQL.

---

# Status History Representation

There is no separate `StatusHistory` model.

Status-related history is represented through:

```text
JobActivity
```

For example:

```text
Job
 │
 └── JobActivity
       ├── CREATED
       ├── STATUS_CHANGED
       ├── INTERVIEW
       ├── OFFER
       └── REJECTED
```

---

# Complete Relationship Diagram

```text
                           ┌──────────────────────┐
                           │         User         │
                           └──────────┬───────────┘
                                      │
              ┌───────────────────────┼───────────────────────┐
              │                       │                       │
              │                       │                       │
              ▼                       ▼                       ▼
   ┌──────────────────┐     ┌──────────────────┐    ┌────────────────────┐
   │ PasswordResetToken│     │       Resume     │    │    Notification    │
   └──────────────────┘     └────────┬─────────┘    └─────────┬──────────┘
                                     │                        │
                                     │                        │
                                     │                        │
                                     ▼                        │
                              ┌───────────────┐               │
                              │      Job      │◄──────────────┘
                              └───────┬───────┘
                                      │
                 ┌────────────────────┼────────────────────┐
                 │                    │                    │
                 ▼                    ▼                    ▼
        ┌────────────────┐   ┌────────────────┐   ┌────────────────────┐
        │  JobActivity   │   │   Interview    │   │   JobAiAnalysis    │
        └────────────────┘   └────────────────┘   └─────────┬──────────┘
                                                            │
                                                            │
                                                            ▼
                                                         Resume
```

---

# Database Model Summary

| Model              | Main Relationship                                           |
| ------------------ | ----------------------------------------------------------- |
| User               | Parent of Jobs, Resumes, Notifications, PasswordResetTokens |
| PasswordResetToken | Belongs to User                                             |
| Job                | Belongs to User                                             |
| JobActivity        | Belongs to Job                                              |
| Interview          | Belongs to Job                                              |
| Notification       | Belongs to User, optionally Job                             |
| Resume             | Belongs to User; can be associated with Jobs                |
| JobAiAnalysis      | Belongs to Job and optionally Resume                        |

---

# Storage Relationship

The database does not store the actual binary resume or avatar files.

Instead:

```text
                    PostgreSQL
                       │
              ┌────────┴────────┐
              │                 │
        Resume Metadata      User.avatar
              │                 │
              └────────┬────────┘
                       │
                       ▼
                Supabase Storage
                 │             │
                 ▼             ▼
              Resumes        Avatars
```

PostgreSQL stores references and metadata while Supabase Storage stores the actual files.

---

# Important Design Notes

The current schema intentionally keeps the data model relatively simple.

There is currently:

```text
No Company table
No Recruiter table
No Document table
No StatusHistory table
```

Instead:

```text
Company       → Job.company
Status History → JobActivity
Documents     → Resume
```

This reflects the actual Prisma schema currently used by JobTrack AI.
