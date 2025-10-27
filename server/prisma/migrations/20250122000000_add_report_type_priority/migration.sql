-- CreateEnum
CREATE TYPE "ReportType" AS ENUM ('FRAUD', 'INAPPROPRIATE', 'SPAM', 'DUPLICATE', 'COMMENT', 'OTHER');

-- CreateEnum
CREATE TYPE "Priority" AS ENUM ('LOW', 'MEDIUM', 'HIGH', 'URGENT');

-- AlterTable
ALTER TABLE "CagnotteReport" ADD COLUMN     "type" "ReportType" NOT NULL DEFAULT 'OTHER',
ADD COLUMN     "priority" "Priority" NOT NULL DEFAULT 'MEDIUM';

-- CreateIndex
CREATE INDEX "CagnotteReport_type_idx" ON "CagnotteReport"("type");

-- CreateIndex
CREATE INDEX "CagnotteReport_priority_idx" ON "CagnotteReport"("priority");