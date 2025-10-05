/*
  Warnings:

  - Added the required column `email` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `firstname` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `lastname` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `phone` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Made the column `firstname` on table `User` required. This step will fail if there are existing NULL values in that column.
  - Made the column `lastname` on table `User` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "email" TEXT NOT NULL,
ADD COLUMN     "firstname" TEXT NOT NULL,
ADD COLUMN     "lastname" TEXT NOT NULL,
ADD COLUMN     "phone" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "firstname" SET NOT NULL,
ALTER COLUMN "lastname" SET NOT NULL;
