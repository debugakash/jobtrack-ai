-- AlterTable
ALTER TABLE "users" ADD COLUMN     "emailNotifications" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "followUpReminders" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "interviewReminders" BOOLEAN NOT NULL DEFAULT true;
