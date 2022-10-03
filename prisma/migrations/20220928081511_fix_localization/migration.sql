/*
  Warnings:

  - You are about to drop the column `localisation` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Personel" ADD COLUMN     "isRequest" BOOLEAN NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "localisation",
ADD COLUMN     "localization" TEXT NOT NULL DEFAULT 'US';
