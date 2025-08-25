-- CreateEnum
CREATE TYPE "public"."DocumentType" AS ENUM ('CARTE_IDENTITE', 'PASSEPORT');

-- CreateEnum
CREATE TYPE "public"."VerificationStatus" AS ENUM ('PENDING', 'VERIFIED', 'REJECTED', 'BLOCKED', 'EXPIRED');

-- CreateEnum
CREATE TYPE "public"."RiskLevel" AS ENUM ('LOW', 'MEDIUM', 'HIGH', 'BLOCKED');

-- CreateTable
CREATE TABLE "public"."KYCVerification" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "documentType" "public"."DocumentType" NOT NULL,
    "documentFrontUrl" TEXT NOT NULL,
    "documentBackUrl" TEXT,
    "verificationStatus" "public"."VerificationStatus" NOT NULL DEFAULT 'PENDING',
    "riskScore" INTEGER NOT NULL DEFAULT 0,
    "verificationDate" TIMESTAMP(3),
    "expiryDate" TIMESTAMP(3),
    "rejectionReason" TEXT,
    "jumioReference" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "KYCVerification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."AMLCheck" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "ofacStatus" BOOLEAN NOT NULL DEFAULT false,
    "unStatus" BOOLEAN NOT NULL DEFAULT false,
    "lastCheckDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "riskLevel" "public"."RiskLevel" NOT NULL DEFAULT 'LOW',
    "suspiciousActivity" BOOLEAN NOT NULL DEFAULT false,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AMLCheck_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."KYCAuditLog" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "details" TEXT NOT NULL,
    "adminId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "KYCAuditLog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "KYCVerification_userId_key" ON "public"."KYCVerification"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "AMLCheck_userId_key" ON "public"."AMLCheck"("userId");

-- AddForeignKey
ALTER TABLE "public"."KYCVerification" ADD CONSTRAINT "KYCVerification_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."AMLCheck" ADD CONSTRAINT "AMLCheck_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."KYCAuditLog" ADD CONSTRAINT "KYCAuditLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."KYCAuditLog" ADD CONSTRAINT "KYCAuditLog_adminId_fkey" FOREIGN KEY ("adminId") REFERENCES "public"."User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
