/*
  Warnings:

  - You are about to drop the column `language` on the `User` table. All the data in the column will be lost.
  - You are about to alter the column `name` on the `User` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(300)`.
  - Made the column `profilePicture` on table `User` required. This step will fail if there are existing NULL values in that column.
  - Made the column `name` on table `User` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "language",
ADD COLUMN     "firstRun" BOOLEAN NOT NULL DEFAULT true,
ALTER COLUMN "profilePicture" SET NOT NULL,
ALTER COLUMN "profilePicture" SET DEFAULT '',
ALTER COLUMN "name" SET NOT NULL,
ALTER COLUMN "name" SET DEFAULT '',
ALTER COLUMN "name" SET DATA TYPE VARCHAR(300);

-- CreateTable
CREATE TABLE "Personel" (
    "_id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "position" VARCHAR(50) NOT NULL,
    "canDrive" BOOLEAN NOT NULL DEFAULT false,
    "canSeeReports" BOOLEAN NOT NULL DEFAULT false,
    "canSeeRequests" BOOLEAN NOT NULL DEFAULT false,
    "isEnable" BOOLEAN NOT NULL DEFAULT true,
    "isManager" BOOLEAN NOT NULL DEFAULT false,
    "agencyId" TEXT NOT NULL,

    CONSTRAINT "Personel_pkey" PRIMARY KEY ("_id")
);

-- CreateTable
CREATE TABLE "Trips" (
    "_id" TEXT NOT NULL,
    "tripName" VARCHAR(50) NOT NULL,
    "tripDescription" VARCHAR(300) NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "startDateTime" TIMESTAMPTZ NOT NULL,
    "endDateTime" TIMESTAMPTZ NOT NULL,
    "destination" VARCHAR(300) NOT NULL,
    "destinationLatitude" DOUBLE PRECISION NOT NULL,
    "destinationLongitude" DOUBLE PRECISION NOT NULL,
    "sourceLatitude" DOUBLE PRECISION NOT NULL,
    "sourceLongitude" DOUBLE PRECISION NOT NULL,
    "userId" TEXT NOT NULL,
    "personelId" TEXT NOT NULL,

    CONSTRAINT "Trips_pkey" PRIMARY KEY ("_id")
);

-- AddForeignKey
ALTER TABLE "Personel" ADD CONSTRAINT "Personel_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Personel" ADD CONSTRAINT "Personel_agencyId_fkey" FOREIGN KEY ("agencyId") REFERENCES "Agency"("_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Trips" ADD CONSTRAINT "Trips_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Trips" ADD CONSTRAINT "Trips_personelId_fkey" FOREIGN KEY ("personelId") REFERENCES "Personel"("_id") ON DELETE RESTRICT ON UPDATE CASCADE;
