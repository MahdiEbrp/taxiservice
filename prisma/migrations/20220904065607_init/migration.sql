-- CreateTable
CREATE TABLE "User" (
    "_id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "createdAt" TIMESTAMPTZ NOT NULL,
    "verifiedCodeDate" TIMESTAMPTZ NOT NULL,
    "verifiedCode" TEXT NOT NULL,
    "verified" BOOLEAN NOT NULL DEFAULT false,
    "resetCodeDate" TIMESTAMPTZ,
    "resetCode" TEXT,

    CONSTRAINT "User_pkey" PRIMARY KEY ("_id")
);

-- CreateTable
CREATE TABLE "Agency" (
    "_id" TEXT NOT NULL,
    "agencyName" VARCHAR(50) NOT NULL,
    "isEnable" BOOLEAN NOT NULL DEFAULT true,
    "phoneNumber1" VARCHAR(30) NOT NULL,
    "phoneNumber2" VARCHAR(30) NOT NULL,
    "mobileNumber" VARCHAR(30) NOT NULL,
    "address" VARCHAR(300) NOT NULL,
    "latitude" DOUBLE PRECISION NOT NULL,
    "longitude" DOUBLE PRECISION NOT NULL,
    "workingDays" INTEGER NOT NULL,
    "startOfWorkingHours" TIMESTAMPTZ NOT NULL,
    "endOfWorkingHours" TIMESTAMPTZ NOT NULL,
    "createdAt" TIMESTAMPTZ NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "Agency_pkey" PRIMARY KEY ("_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Agency_agencyName_key" ON "Agency"("agencyName");

-- AddForeignKey
ALTER TABLE "Agency" ADD CONSTRAINT "Agency_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("_id") ON DELETE RESTRICT ON UPDATE CASCADE;
