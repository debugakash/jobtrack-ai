# JobTrack AI

A production-style **Full Stack Job Application Tracker** built with modern web technologies to help job seekers organize applications, manage interviews, track resumes, monitor progress, and gain actionable insights throughout their job search.

The project is being built with a strong focus on clean architecture, scalable design, maintainable code, and real-world software engineering practices.

---

# 🚀 Current Status

**Backend:** ✅ ~90% Complete

**Frontend:** 🚧 Starting Development

This project is actively being developed following an incremental, feature-based workflow with Git version control and comprehensive documentation.

---

# ✨ Features

## 🔐 Authentication

- User Registration
- User Login
- JWT Authentication
- Protected Routes
- Password Hashing with bcrypt

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

---

## 📊 Dashboard & Analytics

- Total Applications
- Applications by Status
- Monthly Applications
- Top Companies
- Pending Follow-ups

---

## 📝 Activity Timeline

Automatic activity tracking for:

- Job Created
- Status Changes
- Interview Events
- Offer Updates
- Rejections

---

## 🎯 Interview Management

- Schedule Interviews
- Update Interview Details
- Mark Interviews as Completed
- Delete Interviews

---

## 📄 Resume Management

- Upload Resume (PDF, DOC, DOCX)
- Download Resume
- Delete Resume
- Default Resume Support
- Secure File Management

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

---

## Backend

- Node.js
- Express.js
- TypeScript
- Prisma ORM
- PostgreSQL
- JWT Authentication
- Multer (File Uploads)
- Zod Validation

---

## Development Tools

- Git
- GitHub
- Bruno (API Testing)
- Prisma Studio
- ESLint
- Prettier

---

# 📂 Project Structure

```text
jobtrack-ai/
│
├── client/                 # React Frontend (In Progress)
│
├── server/                 # Express Backend
│   ├── prisma/
│   ├── src/
│   ├── uploads/
│   └── package.json
│
├── docs/
│   └── ROADMAP.md
│
└── README.md
```

---

# 🏗 Backend Architecture

The backend follows a layered architecture:

```text
Routes
   │
Controllers
   │
Services
   │
Repositories
   │
Prisma ORM
   │
PostgreSQL
```

This separation keeps business logic independent from HTTP handling and database access, making the project easier to maintain and extend.

---

# 📚 Documentation

Project planning and future milestones are maintained in:

```text
docs/ROADMAP.md
```

---

# 🚀 Getting Started

## Clone the repository

```bash
git clone https://github.com/<your-username>/jobtrack-ai.git
cd jobtrack-ai
```

---

## Backend Setup

```bash
cd server
npm install
```

Create a `.env` file with your local configuration.

Run database migrations:

```bash
npx prisma migrate dev
```

Generate the Prisma Client:

```bash
npx prisma generate
```

Start the development server:

```bash
npm run dev
```

---

## Frontend Setup

_(Coming Soon)_

---

# 🎯 Upcoming Features

- Attach Resume to Jobs
- Follow-up Reminder Scheduler
- Email Notifications
- Advanced Analytics
- AWS S3 / Cloudflare R2 Storage
- AI Resume Matching
- AI Job Insights
- Production Deployment

See `docs/ROADMAP.md` for the complete roadmap.

---

# 🤝 Contributing

Contributions, suggestions, and feedback are always welcome.

Feel free to open an issue or submit a pull request.

---

# 📄 License

This project is licensed under the MIT License.
