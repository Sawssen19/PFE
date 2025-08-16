/*
  Warnings:

  - You are about to drop the column `status` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `verificationToken` on the `User` table. All the data in the column will be lost.
  - You are about to drop the `Cagnotte` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Category` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Promise` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Cagnotte" DROP CONSTRAINT "Cagnotte_beneficiaryId_fkey";

-- DropForeignKey
ALTER TABLE "Cagnotte" DROP CONSTRAINT "Cagnotte_categoryId_fkey";

-- DropForeignKey
ALTER TABLE "Cagnotte" DROP CONSTRAINT "Cagnotte_creatorId_fkey";

-- DropForeignKey
ALTER TABLE "Promise" DROP CONSTRAINT "Promise_cagnotteId_fkey";

-- DropForeignKey
ALTER TABLE "Promise" DROP CONSTRAINT "Promise_contributorId_fkey";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "status",
DROP COLUMN "verificationToken",
ADD COLUMN     "isVerified" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "profileDescription" TEXT,
ADD COLUMN     "profilePicture" TEXT,
ADD COLUMN     "profileUrl" TEXT,
ADD COLUMN     "profileVisibility" TEXT NOT NULL DEFAULT 'public';

-- DropTable
DROP TABLE "Cagnotte";

-- DropTable
DROP TABLE "Category";

-- DropTable
DROP TABLE "Promise";

-- DropEnum
DROP TYPE "CagnotteStatus";

-- DropEnum
DROP TYPE "PromiseStatus";

-- DropEnum
DROP TYPE "UserStatus";
