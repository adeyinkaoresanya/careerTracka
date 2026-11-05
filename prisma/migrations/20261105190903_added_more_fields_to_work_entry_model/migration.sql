/*
  Warnings:

  - Added the required column `experienceLevel` to the `WorkEntry` table without a default value. This is not possible if the table is not empty.
  - Added the required column `industry` to the `WorkEntry` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "WorkEntry" ADD COLUMN     "experienceLevel" TEXT NOT NULL,
ADD COLUMN     "industry" TEXT NOT NULL;
