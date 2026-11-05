/*
  Warnings:

  - You are about to drop the column `jobTitle` on the `WorkEntry` table. All the data in the column will be lost.
  - Added the required column `jobRole` to the `WorkEntry` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "WorkEntry" DROP COLUMN "jobTitle",
ADD COLUMN     "jobRole" TEXT NOT NULL;
