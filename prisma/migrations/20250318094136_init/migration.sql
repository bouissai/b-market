/*
  Warnings:

  - You are about to drop the column `categoryName` on the `Article` table. All the data in the column will be lost.
  - Added the required column `categoryId` to the `Article` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Article" DROP CONSTRAINT "Article_categoryName_fkey";

-- AlterTable
ALTER TABLE "Article" DROP COLUMN "categoryName",
ADD COLUMN     "categoryId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Article" ADD CONSTRAINT "Article_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
