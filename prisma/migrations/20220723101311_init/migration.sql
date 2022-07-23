-- CreateTable
CREATE TABLE "User" (
    "_id" TEXT NOT NULL,
    "displayName" TEXT,
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

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
