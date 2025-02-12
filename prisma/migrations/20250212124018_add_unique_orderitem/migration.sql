/*
  Warnings:

  - A unique constraint covering the columns `[orderId,articleId]` on the table `OrderItem` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "OrderItem_orderId_articleId_key" ON "OrderItem"("orderId", "articleId");
