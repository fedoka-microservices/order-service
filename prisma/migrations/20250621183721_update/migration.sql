/*
  Warnings:

  - You are about to drop the column `paidAt` on the `Order` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Order" DROP COLUMN "paidAt",
ALTER COLUMN "status" DROP DEFAULT;
