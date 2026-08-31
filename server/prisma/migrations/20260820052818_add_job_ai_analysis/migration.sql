-- CreateTable
CREATE TABLE "job_ai_analyses" (
    "id" TEXT NOT NULL,
    "matchScore" INTEGER NOT NULL,
    "matchingSkills" TEXT[],
    "missingSkills" TEXT[],
    "suggestions" TEXT[],
    "provider" TEXT NOT NULL,
    "model" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "jobId" TEXT NOT NULL,
    "resumeId" TEXT,

    CONSTRAINT "job_ai_analyses_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "job_ai_analyses_jobId_key" ON "job_ai_analyses"("jobId");

-- CreateIndex
CREATE INDEX "job_ai_analyses_jobId_idx" ON "job_ai_analyses"("jobId");

-- CreateIndex
CREATE INDEX "job_ai_analyses_createdAt_idx" ON "job_ai_analyses"("createdAt");

-- AddForeignKey
ALTER TABLE "job_ai_analyses" ADD CONSTRAINT "job_ai_analyses_jobId_fkey" FOREIGN KEY ("jobId") REFERENCES "jobs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "job_ai_analyses" ADD CONSTRAINT "job_ai_analyses_resumeId_fkey" FOREIGN KEY ("resumeId") REFERENCES "resumes"("id") ON DELETE SET NULL ON UPDATE CASCADE;
