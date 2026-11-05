-- AlterTable
ALTER TABLE "Achievement" ADD COLUMN     "deletedAt" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "AnalysisSession" ADD COLUMN     "deletedAt" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "WorkEntry" ADD COLUMN     "deletedAt" TIMESTAMP(3);
