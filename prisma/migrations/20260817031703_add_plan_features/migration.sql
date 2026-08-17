-- AlterTable
ALTER TABLE "Plan" ADD COLUMN     "features" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "highlight" TEXT;
