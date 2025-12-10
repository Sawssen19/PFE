-- CreateEnum
CREATE TYPE "public"."LogCategory" AS ENUM ('ADMIN', 'USER', 'CAGNOTTE', 'REPORT', 'SYSTEM', 'AUTH');

-- CreateEnum
CREATE TYPE "public"."LogLevel" AS ENUM ('INFO', 'WARNING', 'ERROR', 'SECURITY', 'DEBUG');

-- CreateEnum
CREATE TYPE "public"."LogSeverity" AS ENUM ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL');

-- CreateTable
CREATE TABLE "public"."AdminLog" (
    "id" TEXT NOT NULL,
    "adminId" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "category" "public"."LogCategory" NOT NULL DEFAULT 'ADMIN',
    "level" "public"."LogLevel" NOT NULL DEFAULT 'INFO',
    "severity" "public"."LogSeverity" NOT NULL DEFAULT 'LOW',
    "description" TEXT NOT NULL,
    "entityType" TEXT,
    "entityId" TEXT,
    "metadata" JSONB,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AdminLog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "AdminLog_adminId_idx" ON "public"."AdminLog"("adminId");

-- CreateIndex
CREATE INDEX "AdminLog_action_idx" ON "public"."AdminLog"("action");

-- CreateIndex
CREATE INDEX "AdminLog_category_idx" ON "public"."AdminLog"("category");

-- CreateIndex
CREATE INDEX "AdminLog_createdAt_idx" ON "public"."AdminLog"("createdAt");

-- CreateIndex
CREATE INDEX "AdminLog_entityType_entityId_idx" ON "public"."AdminLog"("entityType", "entityId");

-- AddForeignKey
ALTER TABLE "public"."AdminLog" ADD CONSTRAINT "AdminLog_adminId_fkey" FOREIGN KEY ("adminId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;


