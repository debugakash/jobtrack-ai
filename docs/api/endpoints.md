# JobTrack AI API Endpoints

## Overview

JobTrack AI exposes a REST API consumed by the React frontend.

The backend is built with:

- Node.js
- Express.js
- TypeScript
- Prisma ORM
- PostgreSQL
- JWT Authentication
- Zod
- Multer
- Supabase Storage
- Google Gemini API

Protected endpoints require authentication using the application's JWT authentication middleware.

---

# Base API Structure

The primary API routes use the `/api` prefix.

```text
/api
├── /auth
├── /users
├── /jobs
├── /interviews
├── /resumes
├── /dashboard
├── /analytics
├── /notifications
└── /ai
```

The exact server host and port depend on the environment configuration.

Development example:

```text
http://localhost:<PORT>/api
```

---

# Standard Response Format

Most JSON responses follow this structure:

```json
{
  "success": true,
  "data": {}
}
```

Some endpoints also include a message:

```json
{
  "success": true,
  "message": "Operation completed successfully",
  "data": {}
}
```

Endpoints that delete resources may return either a JSON success response or HTTP `204 No Content`, depending on the resource.

---

# Authentication

Authentication endpoints are available under:

```text
/api/auth
```

## Register

```http
POST /api/auth/register
```

Creates a new user account.

### Authentication

Not required.

### Validation

Request data is validated using `registerSchema`.

### Success Response

**Status:** `201 Created`

```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "id": "...",
    "firstName": "...",
    "lastName": "...",
    "email": "..."
  }
}
```

---

## Login

```http
POST /api/auth/login
```

Authenticates a user and returns the authenticated user together with an access token.

### Authentication

Not required.

### Validation

Request data is validated using `loginSchema`.

### Success Response

**Status:** `200 OK`

The response contains:

- User ID
- First Name
- Last Name
- Email
- Avatar path
- Signed Avatar URL
- Phone
- Location
- Headline
- Bio
- LinkedIn URL
- GitHub URL
- Portfolio URL
- Skills
- Email verification state
- Active state
- Account creation date
- Notification preferences
- JWT access token

Conceptually:

```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": "...",
      "firstName": "...",
      "lastName": "...",
      "email": "...",
      "avatar": "...",
      "avatarUrl": "...",
      "phone": "...",
      "location": "...",
      "headline": "...",
      "bio": "...",
      "linkedinUrl": "...",
      "githubUrl": "...",
      "portfolioUrl": "...",
      "skills": "...",
      "emailVerified": false,
      "isActive": true,
      "createdAt": "...",
      "emailNotifications": true,
      "interviewReminders": true,
      "followUpReminders": true
    },
    "accessToken": "..."
  }
}
```

---

## Forgot Password

```http
POST /api/auth/forgot-password
```

Starts the password recovery process.

### Authentication

Not required.

### Validation

Request data is validated using `forgotPasswordSchema`.

### Success Response

**Status:** `200 OK`

```json
{
  "success": true,
  "message": "If an account exists with this email, a password reset link has been sent."
}
```

The response intentionally does not reveal whether the supplied email belongs to an existing account.

---

## Reset Password

```http
POST /api/auth/reset-password
```

Resets a user's password using a valid password reset token.

### Authentication

Not required.

### Validation

Request data is validated using `resetPasswordSchema`.

### Success Response

**Status:** `200 OK`

```json
{
  "success": true,
  "message": "Password reset successfully"
}
```

---

## Get Current User

```http
GET /api/auth/me
```

Returns the currently authenticated user's profile and preference information.

### Authentication

Required.

### Success Response

**Status:** `200 OK`

The response includes:

- User ID
- First Name
- Last Name
- Email
- Avatar
- Signed Avatar URL
- Phone
- Location
- Headline
- Bio
- LinkedIn URL
- GitHub URL
- Portfolio URL
- Skills
- Email verification state
- Active state
- Account creation date
- Notification preferences

---

## Update Avatar

```http
PATCH /api/auth/me/avatar
```

Uploads or replaces the authenticated user's profile avatar.

### Authentication

Required.

### Request Type

```text
multipart/form-data
```

### File Field

```text
avatar
```

If no avatar file is provided, the API returns a bad-request error.

The uploaded image is stored through the application's `StorageService`.

### Success Response

**Status:** `200 OK`

```json
{
  "success": true,
  "message": "Avatar updated successfully",
  "data": {
    "avatar": "...",
    "avatarUrl": "..."
  }
}
```

`avatarUrl` is generated using a secure signed URL.

---

## Change Password

```http
PATCH /api/auth/me/password
```

Changes the authenticated user's password.

### Authentication

Required.

### Validation

Request data is validated using `changePasswordSchema`.

The validated request contains the user's current password and new password.

### Success Response

**Status:** `200 OK`

```json
{
  "success": true,
  "message": "Password changed successfully"
}
```

---

## Delete Account

```http
DELETE /api/auth/me
```

Deletes the authenticated user's account.

### Authentication

Required.

Associated application data is deleted according to the configured database relationships and account-deletion service logic.

### Success Response

**Status:** `200 OK`

```json
{
  "success": true,
  "message": "Account deleted successfully"
}
```

---

# User Profile

User-related endpoints are available under:

```text
/api/users
```

## Update Profile

```http
PATCH /api/users/me
```

Updates profile information for the authenticated user.

### Authentication

Required.

### Validation

Request data is validated using `updateProfileSchema`.

Profile information can include areas such as:

- First Name
- Last Name
- Phone
- Location
- Headline
- Bio
- LinkedIn URL
- GitHub URL
- Portfolio URL
- Skills

### Success Response

**Status:** `200 OK`

```json
{
  "success": true,
  "message": "Profile updated successfully",
  "data": {
    "id": "...",
    "firstName": "...",
    "lastName": "...",
    "email": "...",
    "avatar": "...",
    "phone": "...",
    "location": "...",
    "headline": "...",
    "bio": "...",
    "linkedinUrl": "...",
    "githubUrl": "...",
    "portfolioUrl": "...",
    "skills": "...",
    "emailVerified": false,
    "isActive": true,
    "createdAt": "..."
  }
}
```

---

## Update User Preferences

```http
PATCH /api/users/me/preferences
```

Updates notification-related preferences for the authenticated user.

### Authentication

Required.

### Validation

Request data is validated using `updateUserPreferencesSchema`.

Current preference areas include:

- Email Notifications
- Interview Reminders
- Follow-up Reminders

### Success Response

**Status:** `200 OK`

```json
{
  "success": true,
  "message": "Notification preferences updated successfully",
  "data": {}
}
```

---

# Jobs

Job-management endpoints are available under:

```text
/api/jobs
```

## Get Jobs

```http
GET /api/jobs
```

Returns the authenticated user's job applications.

### Authentication

Required.

### Query Validation

Query parameters are validated using `getJobsQuerySchema`.

The job-listing implementation supports:

- Search
- Filtering
- Sorting
- Pagination

### Success Response

**Status:** `200 OK`

```json
{
  "success": true,
  "data": [],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 0,
    "totalPages": 0,
    "hasNextPage": false,
    "hasPreviousPage": false
  }
}
```

The exact supported query parameter names and values are defined by `getJobsQuerySchema`.

---

## Get Job by ID

```http
GET /api/jobs/:id
```

Returns a specific job application owned by the authenticated user.

### Authentication

Required.

### Path Parameters

| Parameter | Description |
| --------- | ----------- |
| `id`      | Job ID      |

### Success Response

**Status:** `200 OK`

```json
{
  "success": true,
  "data": {}
}
```

---

## Create Job

```http
POST /api/jobs
```

Creates a new job application.

### Authentication

Required.

### Validation

Request data is validated using `createJobSchema`.

The job model supports information such as:

- Company
- Job Title
- Description
- Location
- Job Type
- Work Mode
- Salary Minimum
- Salary Maximum
- Status
- Source
- Job URL
- Notes
- Resume Association
- Follow-up Date
- Follow-up Completion State
- Application Date

### Success Response

**Status:** `201 Created`

```json
{
  "success": true,
  "message": "Job created successfully",
  "data": {}
}
```

---

## Update Job

```http
PATCH /api/jobs/:id
```

Updates an existing job application.

### Authentication

Required.

### Path Parameters

| Parameter | Description |
| --------- | ----------- |
| `id`      | Job ID      |

### Validation

Request data is validated using `updateJobSchema`.

### Success Response

**Status:** `200 OK`

```json
{
  "success": true,
  "data": {}
}
```

---

## Delete Job

```http
DELETE /api/jobs/:id
```

Deletes a job application.

### Authentication

Required.

### Path Parameters

| Parameter | Description |
| --------- | ----------- |
| `id`      | Job ID      |

### Success Response

**Status:** `200 OK`

```json
{
  "success": true,
  "message": "Job deleted successfully"
}
```

---

# Job Activity Timeline

Job-activity endpoints are mounted under:

```text
/api/jobs
```

## Get Job Activities

```http
GET /api/jobs/:jobId/activities
```

Returns the activity timeline for a specific job owned by the authenticated user.

### Authentication

Required.

### Path Parameters

| Parameter | Description |
| --------- | ----------- |
| `jobId`   | Job ID      |

Activity types supported by the database include:

- `CREATED`
- `STATUS_CHANGED`
- `NOTE`
- `FOLLOW_UP`
- `INTERVIEW`
- `RESUME`
- `OFFER`
- `REJECTED`
- `OTHER`

### Success Response

**Status:** `200 OK`

```json
{
  "success": true,
  "data": []
}
```

---

# Interviews

Interview endpoints are mounted through the main API router.

All interview routes are protected by authentication middleware.

## Create Interview

```http
POST /api/jobs/:jobId/interviews
```

Creates an interview for a specific job application.

### Authentication

Required.

### Path Parameters

| Parameter | Description |
| --------- | ----------- |
| `jobId`   | Job ID      |

### Validation

Request data is validated using `createInterviewSchema`.

### Success Response

**Status:** `201 Created`

```json
{
  "success": true,
  "data": {}
}
```

---

## Get Interviews for Job

```http
GET /api/jobs/:jobId/interviews
```

Returns all interviews associated with a specific job.

### Authentication

Required.

### Path Parameters

| Parameter | Description |
| --------- | ----------- |
| `jobId`   | Job ID      |

### Success Response

**Status:** `200 OK`

```json
{
  "success": true,
  "data": []
}
```

---

## Get All User Interviews

```http
GET /api/interviews
```

Returns interviews across all job applications belonging to the authenticated user.

### Authentication

Required.

### Success Response

**Status:** `200 OK`

```json
{
  "success": true,
  "data": []
}
```

---

## Get Interview by ID

```http
GET /api/interviews/:interviewId
```

Returns a specific interview.

### Authentication

Required.

### Path Parameters

| Parameter     | Description  |
| ------------- | ------------ |
| `interviewId` | Interview ID |

### Success Response

**Status:** `200 OK`

```json
{
  "success": true,
  "data": {}
}
```

---

## Update Interview

```http
PATCH /api/interviews/:interviewId
```

Updates an existing interview.

### Authentication

Required.

### Path Parameters

| Parameter     | Description  |
| ------------- | ------------ |
| `interviewId` | Interview ID |

### Validation

Request data is validated using `updateInterviewSchema`.

### Success Response

**Status:** `200 OK`

```json
{
  "success": true,
  "data": {}
}
```

---

## Delete Interview

```http
DELETE /api/interviews/:interviewId
```

Deletes an existing interview.

### Authentication

Required.

### Path Parameters

| Parameter     | Description  |
| ------------- | ------------ |
| `interviewId` | Interview ID |

### Success Response

**Status:** `204 No Content`

The response contains no JSON body.

---

# Resumes

Resume endpoints are available under:

```text
/api/resumes
```

## Get Resumes

```http
GET /api/resumes
```

Returns resume records belonging to the authenticated user.

### Authentication

Required.

### Success Response

**Status:** `200 OK`

```json
{
  "success": true,
  "data": []
}
```

---

## Get Resume by ID

```http
GET /api/resumes/:id
```

Returns metadata for a specific resume.

### Authentication

Required.

### Path Parameters

| Parameter | Description |
| --------- | ----------- |
| `id`      | Resume ID   |

### Success Response

**Status:** `200 OK`

```json
{
  "success": true,
  "data": {}
}
```

---

## Upload Resume

```http
POST /api/resumes
```

Uploads a resume for the authenticated user.

### Authentication

Required.

### Request Type

```text
multipart/form-data
```

### File Field

```text
resume
```

If no resume file is supplied, the API returns a bad-request error.

Additional metadata is validated using `createResumeSchema`.

The resume file is handled through the application's storage layer.

### Success Response

**Status:** `201 Created`

```json
{
  "success": true,
  "data": {}
}
```

---

## Download Resume

```http
GET /api/resumes/:id/download
```

Downloads the actual resume file.

### Authentication

Required.

### Path Parameters

| Parameter | Description |
| --------- | ----------- |
| `id`      | Resume ID   |

### Response

The endpoint returns the binary resume file rather than JSON.

Response headers include:

```text
Content-Type: <resume MIME type>
Content-Disposition: attachment; filename="<original filename>"
Content-Length: <file size>
```

---

## Update Resume

```http
PATCH /api/resumes/:id
```

Updates resume metadata.

### Authentication

Required.

### Path Parameters

| Parameter | Description |
| --------- | ----------- |
| `id`      | Resume ID   |

### Validation

Request data is validated using `updateResumeSchema`.

### Success Response

**Status:** `200 OK`

```json
{
  "success": true,
  "data": {}
}
```

---

## Delete Resume

```http
DELETE /api/resumes/:id
```

Deletes a resume.

The associated stored resume file is handled by the resume service.

### Authentication

Required.

### Path Parameters

| Parameter | Description |
| --------- | ----------- |
| `id`      | Resume ID   |

### Success Response

**Status:** `204 No Content`

The response contains no JSON body.

---

# Dashboard

Dashboard endpoints are available under:

```text
/api/dashboard
```

All dashboard endpoints require authentication.

## Dashboard Statistics

```http
GET /api/dashboard/stats
```

Returns high-level job-search statistics.

### Success Response

**Status:** `200 OK`

```json
{
  "success": true,
  "data": {}
}
```

---

## Status Distribution

```http
GET /api/dashboard/status-distribution
```

Returns the number of jobs in each application status.

### Success Response

**Status:** `200 OK`

Conceptually:

```json
{
  "success": true,
  "data": [
    {
      "status": "APPLIED",
      "count": 5
    }
  ]
}
```

---

## Monthly Applications

```http
GET /api/dashboard/monthly-applications
```

Returns monthly job-application statistics.

### Success Response

**Status:** `200 OK`

```json
{
  "success": true,
  "data": []
}
```

---

## Top Companies

```http
GET /api/dashboard/top-companies
```

Returns company-level application statistics used by the dashboard.

### Success Response

**Status:** `200 OK`

```json
{
  "success": true,
  "data": []
}
```

---

## Pending Follow-ups

```http
GET /api/dashboard/follow-ups
```

Returns pending follow-up information for the authenticated user.

### Success Response

**Status:** `200 OK`

```json
{
  "success": true,
  "data": []
}
```

---

## Recent Activity

```http
GET /api/dashboard/recent-activity
```

Returns recent job activity.

### Query Parameters

| Parameter | Default | Description                |
| --------- | ------: | -------------------------- |
| `page`    |     `1` | Activity page number       |
| `limit`   |    `20` | Number of records per page |

Example:

```http
GET /api/dashboard/recent-activity?page=1&limit=20
```

### Success Response

**Status:** `200 OK`

```json
{
  "success": true,
  "data": {}
}
```

---

## Upcoming Interviews

```http
GET /api/dashboard/upcoming-interviews
```

Returns upcoming interviews belonging to the authenticated user.

### Success Response

**Status:** `200 OK`

```json
{
  "success": true,
  "data": []
}
```

---

# Analytics

Analytics endpoints are available under:

```text
/api/analytics
```

## Get Analytics

```http
GET /api/analytics
```

Returns job-search analytics for the authenticated user.

### Authentication

Required.

### Query Parameters

The endpoint accepts the `range` query parameter.

```http
GET /api/analytics?range=365
```

The value is converted to a number and passed to the analytics service.

The special value:

```text
all
```

requests analytics across all available data.

If `range` is omitted, the default is:

```text
365
```

Example:

```http
GET /api/analytics?range=30
```

or:

```http
GET /api/analytics?range=all
```

### Success Response

**Status:** `200 OK`

```json
{
  "success": true,
  "data": {}
}
```

The analytics service provides the application's analytics metrics, including application, conversion, timing, source, and funnel information.

---

# Notifications

Notification endpoints are available under:

```text
/api/notifications
```

## Get Notifications

```http
GET /api/notifications
```

Returns notifications belonging to the authenticated user.

### Authentication

Required.

### Success Response

**Status:** `200 OK`

```json
{
  "success": true,
  "data": []
}
```

---

## Mark Notification as Read

```http
PATCH /api/notifications/:id/read
```

Marks a notification as read.

### Authentication

Required.

### Path Parameters

| Parameter | Description     |
| --------- | --------------- |
| `id`      | Notification ID |

### Success Response

**Status:** `200 OK`

```json
{
  "success": true
}
```

---

## Mark All Notifications as Read

```http
PATCH /api/notifications/read-all
```

Marks all notifications belonging to the authenticated user as read.

### Authentication

Required.

### Success Response

**Status:** `200 OK`

```json
{
  "success": true
}
```

---

# AI Job Analysis

AI endpoints are available under:

```text
/api/ai
```

## Analyze Job

```http
POST /api/ai/jobs/:jobId/analyze
```

Analyzes a job application using the application's AI job-analysis service.

### Authentication

Required.

### Path Parameters

| Parameter | Description |
| --------- | ----------- |
| `jobId`   | Job ID      |

The authenticated user's ID and job ID are passed to the analysis service.

### Success Response

**Status:** `200 OK`

```json
{
  "success": true,
  "data": {}
}
```

The analysis result can contain data such as:

- Match Score
- Matching Skills
- Missing Skills
- Suggestions

The exact result is produced by the AI analysis service.

---

# AI Analysis Flow

The AI analysis process follows this general architecture:

```text
Authenticated User
        │
        ▼
       Job
        │
        ├── Job Description
        │
        └── Associated Resume
                  │
                  ▼
          Resume Processing
                  │
                  ▼
          AI Analysis Service
                  │
                  ▼
             Gemini API
                  │
                  ▼
          JobAiAnalysis
                  │
                  ▼
             PostgreSQL
```

AI analysis results are persisted using the `JobAiAnalysis` database model.

---

# Authentication Requirements

Protected endpoints use the JWT authentication middleware.

Authenticated requests provide an access token using the standard authorization header:

```http
Authorization: Bearer <access-token>
```

The middleware validates the token and makes the authenticated user's ID available through:

```text
req.user.userId
```

---

# HTTP Methods

JobTrack AI uses standard HTTP methods.

| Method   | Purpose                                |
| -------- | -------------------------------------- |
| `GET`    | Retrieve resources                     |
| `POST`   | Create resources or trigger operations |
| `PATCH`  | Partially update resources             |
| `DELETE` | Delete resources                       |

---

# Common Success Status Codes

| Status           | Meaning                                   |
| ---------------- | ----------------------------------------- |
| `200 OK`         | Request completed successfully            |
| `201 Created`    | Resource created successfully             |
| `204 No Content` | Operation completed with no response body |

---

# Error Handling

The backend uses centralized error handling.

Common HTTP error categories include:

```text
400 Bad Request
401 Unauthorized
403 Forbidden
404 Not Found
409 Conflict
500 Internal Server Error
```

Zod validation errors are generated when incoming request data does not satisfy the relevant validator schema.

Application-specific errors are processed by the central error middleware.

---

# File Uploads

Avatar and resume uploads use Multer.

The upload flow is:

```text
Multipart Request
       │
       ▼
Multer
       │
       ▼
Express.Multer.File
       │
       ▼
Application Service
       │
       ▼
StorageService
       │
       ▼
Supabase Storage
```

Resume metadata is stored in PostgreSQL while the actual file is stored through the storage service.

Avatar paths are stored on the user record and displayed using signed URLs.

---

# API Architecture

The backend follows a layered architecture:

```text
Route
  ↓
Middleware
  ↓
Controller
  ↓
Service
  ↓
Repository
  ↓
Prisma
  ↓
PostgreSQL
```

Infrastructure concerns such as storage, email delivery, scheduling, and AI processing are kept inside dedicated services.

---

# Route Mounting

The main Express application mounts routes as follows:

```text
/app
│
├── /api
│   └── routes/index.ts
│       ├── /auth
│       ├── /users
│       ├── /jobs
│       ├── interview routes
│       ├── /resumes
│       └── /ai
│
├── /api/dashboard
│
├── /api/analytics
│
└── /api/notifications
```

The AI routes are mounted through the main `/api` router.

---

# Bruno API Collection

The project also contains a separate root-level `api/` directory used by **Bruno** for API requests and manual endpoint testing.

The Bruno collection is separate from the human-readable API documentation:

```text
jobtrack-ai/
│
├── api/                         # Bruno API collection
│
├── docs/
│   └── api/
│       └── endpoints.md        # Human-readable API documentation
│
└── server/
    └── src/
        ├── routes/             # Express route definitions
        └── controllers/        # HTTP request/response handling
```

The backend route and controller files are the source of truth for implemented API endpoints.

The Bruno collection provides executable API requests for development and manual testing.
