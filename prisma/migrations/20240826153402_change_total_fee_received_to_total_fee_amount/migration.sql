/*
  Warnings:

  - You are about to drop the column `total_fee_received` on the `Student` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Student" DROP COLUMN "total_fee_received",
ADD COLUMN     "total_fee_amount" DOUBLE PRECISION;
