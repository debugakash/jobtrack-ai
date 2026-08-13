# JobTrack AI

A production-style **Full Stack Job Application Tracker** built with modern web technologies to help job seekers organize applications, manage interviews, track resumes, monitor follow-ups, analyze job-search performance, and gain actionable insights throughout their job search.

The project is being developed with a strong focus on clean architecture, scalable design, maintainable code, real-world software engineering practices, and a feature-based development workflow.

---

# 🚀 Current Status

**Backend:** ✅ Core Features Complete

**Frontend:** 🚧 Core Application Features Complete / Ongoing Enhancements

**Analytics:** ✅ Implemented

**Notifications:** ✅ In-app & Email Notifications Implemented

**AI Features:** 🔜 Planned

**Production Deployment:** 🔜 Planned

The project is actively being developed incrementally with Git version control, feature-based architecture, and supporting technical documentation.

---

# ✨ Features

## 🔐 Authentication

- User Registration
- User Login
- JWT Authentication
- Protected Routes
- Password Hashing with bcrypt
- Change Password
- Session-based authenticated application flow

---

## 💼 Job Management

- Create Job
- View Jobs
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
- Track Interview Status
- Mark Interviews as Completed
- Delete Interviews
- Interview-related Activity Tracking

---

## 📄 Resume Management

- Upload Resume
- PDF / DOC / DOCX Support
- Download Resume
- Delete Resume
- Default Resume Support
- Resume Metadata Management
- Associate Resume with Job Applications

Local file storage is currently used during development.

Cloud object storage such as **AWS S3 or Cloudflare R2** is planned for production deployment.

---

## 🔔 Notifications

### In-App Notifications

- Follow-up Reminders
- Interview Notifications
- Job-related Notifications
- Notification Read / Unread State

### Email Notifications

- Automated Email Notifications
- Scheduled Notification Processing
- Email-based Follow-up Reminders

A background scheduler is used to process scheduled notifications.

---

## 📊 Dashboard

The dashboard provides a high-level overview of the job search, including:

- Total Applications
- Application Status Overview
- Upcoming Interviews
- Pending Follow-ups
- Recent Applications
- Application Trends
- Job Search Progress

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

Charts and visualizations are implemented using **Recharts** with light and dark theme support.

---

# 🎨 UI & User Experience

- Responsive Application Layout
- Dashboard
- Sidebar Navigation
- Sticky Application Navigation
- Light / Dark Theme
- Theme-aware Charts
- Responsive Data Visualization
- Accessible Form Components
- Loading Skeletons
- Empty States
- Form Validation
- Toast / User Feedback
- Reusable UI Components

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

---

## Database

**PostgreSQL**

Prisma ORM is used for:

- Database schema management
- Migrations
- Type-safe database queries
- Relational data modeling

The project intentionally uses PostgreSQL as its primary database because the application's data is highly relational, including users, jobs, activities, interviews, resumes, and notifications.

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
├── client/                       # React + TypeScript Frontend
│   └── src/
│       ├── components/
│       ├── features/
│       ├── hooks/
│       ├── layouts/
│       ├── lib/
│       └── ...
│
├── server/                       # Express + TypeScript Backend
│   ├── prisma/
│   ├── src/
│   │   ├── controllers/
│   │   ├── repositories/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── validators/
│   │   ├── middleware/
│   │   └── ...
│   ├── uploads/
│   └── package.json
│
├── docs/
│   └── ROADMAP.md
│
├── .gitignore
├── LICENSE
└── README.md
```
