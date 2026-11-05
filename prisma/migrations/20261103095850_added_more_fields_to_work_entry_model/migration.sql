/*
  Warnings:

  - You are about to drop the column `description` on the `WorkEntry` table. All the data in the column will be lost.
  - You are about to drop the column `title` on the `WorkEntry` table. All the data in the column will be lost.
  - Added the required column `jobContent` to the `WorkEntry` table without a default value. This is not possible if the table is not empty.
  - Added the required column `jobTitle` to the `WorkEntry` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "WorkEntry" DROP COLUMN "description",
DROP COLUMN "title",
ADD COLUMN     "jobContent" TEXT NOT NULL,
ADD COLUMN     "jobTitle" TEXT NOT NULL,
ADD COLUMN     "tools" VARCHAR(255)[];
