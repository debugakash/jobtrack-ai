# JobTrack AI

A production-style **Full Stack Job Application Tracker** built with modern web technologies to help job seekers organize applications, manage interviews, track resumes, monitor follow-ups, analyze job-search performance, and gain actionable insights throughout their job search.

The project is being developed with a strong focus on clean architecture, scalable design, maintainable code, real-world software engineering practices, and a feature-based development workflow.

---

# 🚀 Current Status

**Backend:** ✅ Core Features Complete

**Frontend:** 🚧 Core Application Features Complete / Ongoing Enhancements

**Analytics:** ✅ Implemented

**Notifications:** ✅ In-App & Email Notifications Implemented

**Resume ↔ Job Integration:** ✅ Implemented

**Follow-up & Reminder System:** ✅ Implemented

**AI Features:** ✅ Implemented

**Cloud Storage:** ✅ Implemented

**Automated Testing:** 🔜 Planned

**CI/CD:** 🔜 Planned

**Production Deployment:** 🔜 Planned

The major application features have been implemented. The project is currently moving toward automated testing, production hardening, CI/CD, and deployment.

---

# ✨ Features

## 🔐 Authentication

- User Registration
- User Login
- JWT Authentication
- Protected Routes
- Password Hashing with bcrypt
- Change Password
- Forgot Password
- Password Reset
- Secure Password Reset Tokens
- Password Reset Token Expiration
- Single-use Password Reset Tokens
- Password Reset Email Delivery
- Authenticated Application Flow
- Password Visibility Controls
- Form Validation
- Loading States
- Error Handling

---

## 💼 Job Management

- Create Job
- View Jobs
- View Job Details
- Update Job
- Delete Job
- Search Jobs
- Filter Jobs
- Sort Jobs
- Pagination
- Job Status Tracking
- Job Source Tracking
- Job Type Tracking
- Work Mode Tracking
- Salary Range Tracking
- Job Notes
- Job URL
- Application Date Tracking
- Recruiter Information
- Job Activity History

Supported application sources include:

- LinkedIn
- Naukri
- Indeed
- Referral
- Company Website
- Other

---

## 📝 Activity Timeline

Automatic activity tracking for important job events:

- Job Created
- Status Changes
- Interview Events
- Offer Updates
- Rejections
- Follow-up Events
- Other Job Activities

This provides a historical timeline for each job application.

---

## 🎯 Interview Management

- Schedule Interviews
- Store Interview Details
- Update Interview Details
- Delete Interviews
- Track Interview Status
- Mark Interviews as Completed
- Interview-related Activity Tracking
- Upcoming Interview Tracking
- Interview Reminders

---

## 📄 Resume Management

- Upload Resume
- PDF / DOC / DOCX Support
- Resume List
- Download Resume
- Delete Resume
- Default Resume Support
- Resume Metadata Management
- Resume Selection
- Resume ↔ Job Association
- Secure Cloud Storage
- Secure Signed Download URLs
- Resume File Cleanup

Resume files are stored using cloud object storage rather than the local filesystem.

The storage layer is abstracted behind a `StorageService` interface so the application remains independent of a specific storage provider.

---

## 🔗 Resume ↔ Job Integration

Resumes can be associated with individual job applications.

Supported functionality includes:

- Attach Resume to Job
- View Resume Used for Application
- Change Resume Used
- Automatically Use Default Resume
- Resume Selection During Job Application

This allows users to track which resume version was used for each job application.

---

## 🔔 Follow-up & Reminder System

The application supports scheduled follow-up and interview reminders.

### Follow-up Reminders

- Follow-up Date
- Follow-up Reminder
- Mark Follow-up as Completed
- Upcoming Follow-ups
- Overdue Follow-ups

### Interview Reminders

- Upcoming Interview Notifications
- Interview Reminder Processing
- Completed Interview Handling

### Scheduler

A background scheduler processes scheduled reminders and generates notifications.

```text
Job Application
      ↓
Follow-up Date
      ↓
Scheduled Reminder
      ↓
Background Scheduler
      ↓
Notification
      ↓
Email / In-App Notification
```

---

## 🔔 Notifications

### In-App Notifications

- Follow-up Reminders
- Interview Notifications
- Job-related Notifications
- Notification Read / Unread State
- Notification Management

### Email Notifications

- Automated Email Notifications
- Password Reset Emails
- Follow-up Reminder Emails
- Interview Reminder Emails
- Scheduled Email Processing

A background scheduler is used to process scheduled notification tasks.

---

## 📊 Dashboard

The dashboard provides a high-level overview of the user's job search, including:

- Total Applications
- Application Status Overview
- Upcoming Interviews
- Pending Follow-ups
- Recent Applications
- Application Trends
- Job Search Progress
- Recent Activities

---

# 📈 Analytics

JobTrack AI includes an analytics module for understanding job-search performance.

### Application Metrics

- Total Applications
- Applications by Month
- Applications by Status
- Applications by Source
- Application Funnel

### Conversion Metrics

- Response Rate
- Interview Conversion Rate
- Offer Conversion Rate
- Rejection Rate

### Time-based Metrics

- Average Time to Interview
- Average Time to Response

### Application Sources

Applications can be analyzed by:

- LinkedIn
- Naukri
- Indeed
- Referral
- Company Website
- Other

### Analytics Features

- Date Range Filtering
- Dynamic Metrics
- Interactive Charts
- Responsive Visualizations
- Light / Dark Theme Support
- Theme-aware Tooltips
- Loading States
- Empty States

Charts and visualizations are implemented using **Recharts**.

---

# 🤖 AI Features

JobTrack AI includes AI-powered job analysis functionality for comparing resumes against job descriptions.

## AI Job Analysis

The application can analyze a job against the user's selected resume.

The analysis workflow is:

```text
Resume
   ↓
PDF Text Extraction
   ↓
Job Description
   ↓
AI Processing
   ↓
Resume ↔ Job Comparison
   ↓
Match Score
   ↓
Matching Skills
   ↓
Missing Skills
   ↓
Recommendations
   ↓
Persisted AI Analysis
```

### AI Analysis Includes

- Resume Text Extraction
- Job Description Processing
- Resume ↔ Job Comparison
- Match Score
- Matching Skills
- Missing Skills
- Improvement Recommendations
- AI Analysis Persistence
- Re-analysis Support

AI analysis results are persisted in PostgreSQL so previously generated analysis can be retrieved without requiring another AI request.

---

# 👤 Profile

The application includes a complete user profile system.

Supported profile information includes:

- First Name
- Last Name
- Email
- Profile Avatar
- Phone
- Location
- Professional Headline
- Bio
- LinkedIn
- GitHub
- Portfolio
- Skills

Profile avatars are stored using cloud object storage and served through secure signed URLs.

---

# ⚙️ Settings

The application includes account and preference management.

Supported settings include:

- Change Password
- Theme Preference
- Email Notification Preferences
- Interview Reminder Preferences
- Follow-up Reminder Preferences
- Account Deletion

Account deletion also performs associated cloud storage cleanup for user-owned files.

---

# ☁️ Cloud Storage

User-uploaded files are stored using **Supabase Storage**.

Cloud storage is currently used for:

- Resume Files
- Avatar Images

The storage implementation is abstracted through a common `StorageService` interface.

```text
StorageService
      │
      ├── upload()
      ├── delete()
      ├── getFileBuffer()
      ├── download()
      ├── getFilePath()
      └── getSignedUrl()
```

The current implementation uses:

```text
SupabaseStorageService
        ↓
Supabase Storage
```

Private files are accessed through signed URLs.

The application no longer depends on local filesystem storage for uploaded resumes or avatars.

---

# 🎨 UI & User Experience

- Responsive Application Layout
- Dashboard
- Sticky Navbar
- Sticky Sidebar
- Scrollable Content Area
- Responsive Navigation
- Light / Dark Theme
- Theme-aware Charts
- Responsive Data Visualization
- Accessible Form Components
- Loading Skeletons
- Empty States
- Form Validation
- Toast / User Feedback
- Reusable UI Components
- Responsive Authentication Pages
- Password Visibility Controls
- Loading States
- Error States

---

# 🛠 Tech Stack

## Frontend

- React 19
- TypeScript
- Vite
- React Router
- Tailwind CSS
- shadcn/ui
- TanStack Query
- Zustand
- Axios
- React Hook Form
- Zod
- Recharts
- Lucide React

---

## Backend

- Node.js
- Express.js
- TypeScript
- Prisma ORM
- PostgreSQL
- JWT Authentication
- bcrypt
- Multer
- Zod
- date-fns
- Supabase Storage
- Google Gemini API

---

## Database

**PostgreSQL**

Prisma ORM is used for:

- Database schema management
- Database migrations
- Type-safe database queries
- Relational data modeling
- Transaction handling

The application uses PostgreSQL because its core data is highly relational, including:

- Users
- Jobs
- Job Activities
- Interviews
- Resumes
- Notifications
- Reminders
- AI Analysis

---

## Cloud Storage

**Supabase Storage**

Supabase Storage is used for:

- Resume Files
- Avatar Images

Private files are accessed using secure signed URLs.

---

## AI

**Google Gemini API**

Gemini is used for:

- Job Description Analysis
- Resume ↔ Job Matching
- Skill Matching
- Missing Skill Detection
- Resume Improvement Recommendations

---

## Development Tools

- Git
- GitHub
- VS Code
- Bruno
- Prisma Studio
- ESLint
- Prettier
- npm

---

# 📂 Project Structure

```text
jobtrack-ai/

│
├── client/                         # React + TypeScript Frontend
│   ├── src/
│   │   ├── components/
│   │   ├── features/
│   │   ├── hooks/
│   │   ├── layouts/
│   │   ├── lib/
│   │   ├── services/
│   │   ├── styles/
│   │   ├── types/
│   │   ├── utils/
│   │   └── ...
│   │
│   └── package.json
│
├── server/                         # Express + TypeScript Backend
│   ├── prisma/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── errors/
│   │   ├── middleware/
│   │   ├── repositories/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── utils/
│   │   ├── validators/
│   │   └── ...
│   │
│   └── package.json
│
├── docs/
│   ├── api/
│   ├── architecture/
│   ├── database/
│   ├── screenshots/
│   └── roadmap.md
│
├── .gitignore
├── LICENSE
└── README.md
```

---

# 🏗 Architecture

The backend follows a layered architecture:

```text
HTTP Request
      ↓
Route
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

Cross-cutting concerns such as authentication, validation, error handling, storage, scheduling, and AI processing are separated into dedicated modules.

Storage follows an abstraction-based approach:

```text
Controller
    ↓
Service
    ↓
StorageService
    ↓
SupabaseStorageService
    ↓
Supabase Storage
```

AI processing follows a similar separation:

```text
Controller
    ↓
AI Service
    ↓
Resume Text Extraction
    ↓
Gemini API
    ↓
AI Analysis Result
    ↓
Repository
    ↓
PostgreSQL
```

This architecture keeps infrastructure concerns isolated from application and business logic.

---

# 🔒 Security

Security-related implementation includes:

- Password Hashing with bcrypt
- JWT-based Authentication
- Protected API Routes
- Secure Password Reset Tokens
- Password Reset Token Hashing
- Password Reset Token Expiration
- Single-use Password Reset Tokens
- Previous Reset Token Invalidation
- Input Validation with Zod
- File Type Validation
- File Size Limits
- Private Cloud Storage
- Signed URLs for File Access
- User Ownership Checks
- Account Deletion Cleanup
- Cloud Storage Cleanup

---

# 🧪 Testing

Automated testing is the next major development area before production deployment.

Testing will gradually cover:

- Authentication
- Password Recovery
- Job CRUD Operations
- Resume Operations
- Resume ↔ Job Association
- Interview Management
- Follow-up Reminders
- Notifications
- Analytics
- AI Analysis
- Cloud Storage Operations
- Account Deletion
- API Validation
- Error Handling

The testing strategy will begin with unit tests and gradually expand into service-level and API/integration tests.

---

# 📚 Documentation

Technical documentation is maintained inside the `docs/` directory.

```text
docs/

├── api/
├── architecture/
├── database/
├── screenshots/
└── roadmap.md
```

Documentation covers:

- API Design
- Backend Architecture
- Database Architecture
- Database Schema
- Entity Relationships
- Development Roadmap
- Technical Decisions
- Feature Implementation Details

---

# 🚧 Production Readiness

The major application features are now implemented.

The next phase focuses on preparing JobTrack AI for production deployment.

## Backend

- Production Environment Configuration
- Production Error Handling
- API Security Hardening
- Rate Limiting
- Request Logging
- API Documentation
- Automated Testing

## Database

- Production PostgreSQL Configuration
- Database Backup Strategy
- Database Performance Optimization
- Index Optimization

## Frontend

- Production Build
- Environment Configuration
- Error Boundaries
- Performance Optimization
- Accessibility Improvements
- Mobile Responsive Improvements

## CI/CD

- GitHub Actions
- Automated Testing
- Linting in CI
- Build Verification
- Deployment Pipeline

## Deployment

- Backend Deployment
- Frontend Deployment
- Production PostgreSQL
- Supabase Storage Configuration
- Domain / HTTPS Configuration
- Environment Secrets
- Monitoring

---

# 🗺 Development Roadmap

The project has progressed through the following major phases:

```text
Phase 1 — Backend Foundation
        ↓
Phase 2 — Frontend Application
        ↓
Phase 3 — Analytics
        ↓
Phase 4 — Resume ↔ Job Integration
        ↓
Phase 5 — Follow-up & Reminder System
        ↓
Phase 6 — Notifications & Email
        ↓
Phase 7 — Cloud Storage
        ↓
Phase 8 — Authentication Completion & Auth UI
        ↓
Phase 9 — AI Features
        ↓
Phase 10 — Production Readiness
        ↓
Phase 11 — Automated Testing
        ↓
Phase 12 — CI/CD & Deployment
```

Current milestone:

```text
Major Application Features
        ↓
        ✅
Production Readiness
        ↓
        🚧
Automated Testing
        ↓
        🔜
CI/CD
        ↓
        🔜
Production Deployment
```

---

# 📌 Current Project State

| Area                     | Status      |
| ------------------------ | ----------- |
| Authentication           | ✅ Complete |
| Password Recovery        | ✅ Complete |
| Job Management           | ✅ Complete |
| Activity Timeline        | ✅ Complete |
| Interview Management     | ✅ Complete |
| Resume Management        | ✅ Complete |
| Resume ↔ Job Integration | ✅ Complete |
| Follow-up Reminders      | ✅ Complete |
| Reminder Scheduler       | ✅ Complete |
| In-App Notifications     | ✅ Complete |
| Email Notifications      | ✅ Complete |
| Analytics                | ✅ Complete |
| Profile                  | ✅ Complete |
| Settings                 | ✅ Complete |
| AI Job Analysis          | ✅ Complete |
| Cloud Storage            | ✅ Complete |
| Automated Testing        | 🔜 Planned  |
| CI/CD                    | 🔜 Planned  |
| Production Deployment    | 🔜 Planned  |

---

# 💡 Future Ideas

Potential future enhancements include:

- Browser Extension for Saving Jobs
- Calendar Integration
- Advanced Mobile Experience
- Job Import from Job Boards
- Automated Job Discovery
- AI-Powered Job Recommendations
- AI Resume Improvement
- Resume Version Comparison
- Advanced Job Market Insights
- Job Market Trends
- Personalized Job Search Recommendations

---

# 📜 License

This project is licensed under the MIT License.

See the `LICENSE` file for details.
