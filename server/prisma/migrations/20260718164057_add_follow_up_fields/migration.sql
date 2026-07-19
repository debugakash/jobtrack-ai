-- AlterTable
ALTER TABLE "jobs" ADD COLUMN     "followUpDate" TIMESTAMP(3),
ADD COLUMN     "followUpDone" BOOLEAN NOT NULL DEFAULT false;
