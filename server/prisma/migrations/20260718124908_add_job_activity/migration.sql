-- CreateEnum
CREATE TYPE "JobActivityType" AS ENUM ('CREATED', 'STATUS_CHANGED', 'NOTE', 'FOLLOW_UP', 'INTERVIEW', 'OFFER', 'REJECTED', 'OTHER');

-- CreateTable
CREATE TABLE "job_activities" (
    "id" TEXT NOT NULL,
    "type" "JobActivityType" NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "eventDate" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "jobId" TEXT NOT NULL,

    CONSTRAINT "job_activities_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "job_activities_jobId_idx" ON "job_activities"("jobId");

-- CreateIndex
CREATE INDEX "job_activities_eventDate_idx" ON "job_activities"("eventDate");

-- AddForeignKey
ALTER TABLE "job_activities" ADD CONSTRAINT "job_activities_jobId_fkey" FOREIGN KEY ("jobId") REFERENCES "jobs"("id") ON DELETE CASCADE ON UPDATE CASCADE;
