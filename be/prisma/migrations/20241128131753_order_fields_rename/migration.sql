/*
  Warnings:

  - You are about to drop the column `payment_data` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `total_price` on the `Order` table. All the data in the column will be lost.
  - Added the required column `paymentData` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `totalPrice` to the `Order` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Order" DROP COLUMN "payment_data",
DROP COLUMN "total_price",
ADD COLUMN     "paymentData" JSONB NOT NULL,
ADD COLUMN     "totalPrice" INTEGER NOT NULL;
