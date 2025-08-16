/*
  Warnings:

  - You are about to drop the column `status` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `verificationToken` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "status",
DROP COLUMN "verificationToken",
ALTER COLUMN "profileDescription" SET DEFAULT NULL,
ALTER COLUMN "profilePicture" SET DEFAULT NULL,
ALTER COLUMN "profileUrl" SET DEFAULT NULL,
ALTER COLUMN "profileVisibility" DROP NOT NULL,
ALTER COLUMN "profileVisibility" SET DEFAULT 'private',
ALTER COLUMN "profileVisibility" SET DATA TYPE TEXT;

-- DropEnum
DROP TYPE "UserStatus";
