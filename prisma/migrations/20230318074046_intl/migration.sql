-- CreateTable
CREATE TABLE "Account" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "providerAccountId" TEXT NOT NULL,
    "refresh_token" TEXT,
    "access_token" TEXT,
    "expires_at" INTEGER,
    "token_type" TEXT,
    "scope" TEXT,
    "id_token" TEXT,
    "session_state" TEXT,

    CONSTRAINT "Account_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Session" (
    "id" TEXT NOT NULL,
    "sessionToken" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VerificationToken" (
    "identifier" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL
);

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
    "settingUpdateDate" TIMESTAMPTZ,
    "resetCode" TEXT,
    "profilePicture" TEXT NOT NULL DEFAULT '',
    "name" VARCHAR(300) NOT NULL DEFAULT '',
    "localization" TEXT NOT NULL DEFAULT 'US',
    "accountType" INTEGER NOT NULL DEFAULT 0,

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
    "commissionRate" DOUBLE PRECISION NOT NULL DEFAULT 15,
    "currencySymbol" VARCHAR(20) NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "Agency_pkey" PRIMARY KEY ("_id")
);

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
    "isRequest" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "Personel_pkey" PRIMARY KEY ("_id")
);

-- CreateTable
CREATE TABLE "Trips" (
    "_id" TEXT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "startDateTime" TIMESTAMPTZ NOT NULL,
    "endDateTime" TIMESTAMPTZ NOT NULL,
    "destinationAddress" VARCHAR(300) NOT NULL,
    "destinationLatitude" DOUBLE PRECISION NOT NULL,
    "destinationLongitude" DOUBLE PRECISION NOT NULL,
    "originAddress" VARCHAR(300) NOT NULL,
    "originLatitude" DOUBLE PRECISION NOT NULL,
    "originLongitude" DOUBLE PRECISION NOT NULL,
    "agencyId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "personelId" TEXT,
    "subscriberID" VARCHAR(50),
    "description" VARCHAR(300),
    "status" INTEGER NOT NULL DEFAULT 0,
    "commission" DOUBLE PRECISION NOT NULL DEFAULT 0,

    CONSTRAINT "Trips_pkey" PRIMARY KEY ("_id")
);

-- CreateTable
CREATE TABLE "Prices" (
    "_id" TEXT NOT NULL,
    "address" VARCHAR(800) NOT NULL,
    "latitude" DOUBLE PRECISION NOT NULL,
    "longitude" DOUBLE PRECISION NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "agencyId" TEXT NOT NULL,

    CONSTRAINT "Prices_pkey" PRIMARY KEY ("_id")
);

-- CreateTable
CREATE TABLE "Message" (
    "_id" TEXT NOT NULL,
    "title" VARCHAR(50) NOT NULL,
    "message" VARCHAR(300) NOT NULL,
    "createdAt" TIMESTAMPTZ NOT NULL,
    "isRead" BOOLEAN NOT NULL DEFAULT false,
    "userId" TEXT,
    "senderId" TEXT NOT NULL,

    CONSTRAINT "Message_pkey" PRIMARY KEY ("_id")
);

-- CreateTable
CREATE TABLE "Places" (
    "_id" TEXT NOT NULL,
    "address" VARCHAR(800) NOT NULL,
    "latitude" DOUBLE PRECISION NOT NULL,
    "longitude" DOUBLE PRECISION NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "Places_pkey" PRIMARY KEY ("_id")
);

-- CreateTable
CREATE TABLE "Subscribers" (
    "_id" TEXT NOT NULL,
    "agencyId" TEXT NOT NULL,
    "name" VARCHAR(50) NOT NULL,
    "address" VARCHAR(800) NOT NULL,
    "latitude" DOUBLE PRECISION NOT NULL,
    "longitude" DOUBLE PRECISION NOT NULL,
    "subscriberID" VARCHAR(50) NOT NULL,
    "phoneNumber" VARCHAR(30),
    "description" VARCHAR(300),

    CONSTRAINT "Subscribers_pkey" PRIMARY KEY ("_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Account_provider_providerAccountId_key" ON "Account"("provider", "providerAccountId");

-- CreateIndex
CREATE UNIQUE INDEX "Session_sessionToken_key" ON "Session"("sessionToken");

-- CreateIndex
CREATE UNIQUE INDEX "VerificationToken_token_key" ON "VerificationToken"("token");

-- CreateIndex
CREATE UNIQUE INDEX "VerificationToken_identifier_token_key" ON "VerificationToken"("identifier", "token");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Agency_agencyName_key" ON "Agency"("agencyName");

-- CreateIndex
CREATE UNIQUE INDEX "Subscribers_subscriberID_key" ON "Subscribers"("subscriberID");

-- AddForeignKey
ALTER TABLE "Account" ADD CONSTRAINT "Account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Agency" ADD CONSTRAINT "Agency_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Personel" ADD CONSTRAINT "Personel_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Personel" ADD CONSTRAINT "Personel_agencyId_fkey" FOREIGN KEY ("agencyId") REFERENCES "Agency"("_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Trips" ADD CONSTRAINT "Trips_agencyId_fkey" FOREIGN KEY ("agencyId") REFERENCES "Agency"("_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Trips" ADD CONSTRAINT "Trips_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Trips" ADD CONSTRAINT "Trips_personelId_fkey" FOREIGN KEY ("personelId") REFERENCES "Personel"("_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Prices" ADD CONSTRAINT "Prices_agencyId_fkey" FOREIGN KEY ("agencyId") REFERENCES "Agency"("_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_senderId_fkey" FOREIGN KEY ("senderId") REFERENCES "User"("_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Places" ADD CONSTRAINT "Places_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Subscribers" ADD CONSTRAINT "Subscribers_agencyId_fkey" FOREIGN KEY ("agencyId") REFERENCES "Agency"("_id") ON DELETE RESTRICT ON UPDATE CASCADE;
