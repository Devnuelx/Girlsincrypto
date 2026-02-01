/*
  Warnings:

  - You are about to drop the column `accessType` on the `courses` table. All the data in the column will be lost.
  - You are about to drop the column `price` on the `courses` table. All the data in the column will be lost.
  - You are about to drop the `purchases` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `subscriptions` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "Tier" AS ENUM ('HEIRESS', 'EMPRESS', 'SOVEREIGN');

-- DropForeignKey
ALTER TABLE "purchases" DROP CONSTRAINT "purchases_courseId_fkey";

-- DropForeignKey
ALTER TABLE "purchases" DROP CONSTRAINT "purchases_userId_fkey";

-- DropForeignKey
ALTER TABLE "subscriptions" DROP CONSTRAINT "subscriptions_userId_fkey";

-- AlterTable
ALTER TABLE "courses" DROP COLUMN "accessType",
DROP COLUMN "price",
ADD COLUMN     "isCapped" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "maxEnrollments" INTEGER,
ADD COLUMN     "tier" "Tier" NOT NULL DEFAULT 'HEIRESS';

-- DropTable
DROP TABLE "purchases";

-- DropTable
DROP TABLE "subscriptions";

-- DropEnum
DROP TYPE "AccessType";

-- DropEnum
DROP TYPE "SubStatus";

-- CreateTable
CREATE TABLE "tier_purchases" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "tier" "Tier" NOT NULL,
    "stripePaymentId" TEXT NOT NULL,
    "amount" DECIMAL(10,2) NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'usd',
    "purchasedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "tier_purchases_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "tier_purchases_stripePaymentId_key" ON "tier_purchases"("stripePaymentId");

-- CreateIndex
CREATE UNIQUE INDEX "tier_purchases_userId_tier_key" ON "tier_purchases"("userId", "tier");

-- AddForeignKey
ALTER TABLE "tier_purchases" ADD CONSTRAINT "tier_purchases_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
