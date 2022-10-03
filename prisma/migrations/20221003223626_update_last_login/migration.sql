/*
  Warnings:

  - You are about to drop the column `firstRun` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "firstRun",
ADD COLUMN     "lastLogin" TIMESTAMPTZ;
