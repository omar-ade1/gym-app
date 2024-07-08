-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "userName" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "image" TEXT NOT NULL,
    "Status" TEXT NOT NULL DEFAULT 'not-admin',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Subscriber" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "job" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "tel" TEXT NOT NULL,
    "subStart" TEXT NOT NULL,
    "subDuration" TEXT NOT NULL,
    "remainingSessions" TEXT NOT NULL,
    "subEnd" TEXT NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "qrCode" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "subscriptionInfoId" INTEGER NOT NULL,

    CONSTRAINT "Subscriber_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "subscriptionInfo" (
    "id" SERIAL NOT NULL,
    "duration" INTEGER NOT NULL,
    "typeOfDuration" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "price" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "subscriptionInfo_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_id_key" ON "User"("id");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Subscriber_id_key" ON "Subscriber"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Subscriber_qrCode_key" ON "Subscriber"("qrCode");

-- CreateIndex
CREATE UNIQUE INDEX "Subscriber_token_key" ON "Subscriber"("token");

-- CreateIndex
CREATE UNIQUE INDEX "subscriptionInfo_id_key" ON "subscriptionInfo"("id");

-- AddForeignKey
ALTER TABLE "Subscriber" ADD CONSTRAINT "Subscriber_subscriptionInfoId_fkey" FOREIGN KEY ("subscriptionInfoId") REFERENCES "subscriptionInfo"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
