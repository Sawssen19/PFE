/*
  Warnings:

  - The `profileVisibility` column on the `User` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "User" ADD COLUMN     "verificationToken" TEXT,
DROP COLUMN "profileVisibility",
ADD COLUMN     "profileVisibility" BOOLEAN NOT NULL DEFAULT true;
