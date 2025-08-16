-- AlterTable
ALTER TABLE "User" ADD COLUMN     "verificationExp" TIMESTAMP(3),
ADD COLUMN     "verificationToken" TEXT,
ALTER COLUMN "profileDescription" SET DEFAULT NULL,
ALTER COLUMN "profilePicture" SET DEFAULT NULL,
ALTER COLUMN "profileUrl" SET DEFAULT NULL;
