/*
  Warnings:

  - A unique constraint covering the columns `[cartId,articleId]` on the table `CartItem` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "CartItem_cartId_articleId_key" ON "CartItem"("cartId", "articleId");
