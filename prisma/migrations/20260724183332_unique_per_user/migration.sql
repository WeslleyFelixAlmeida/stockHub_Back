/*
  Warnings:

  - A unique constraint covering the columns `[createdById,name]` on the table `Category` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[createdById,sku]` on the table `Product` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Category_name_key";

-- DropIndex
DROP INDEX "Product_sku_key";

-- CreateIndex
CREATE UNIQUE INDEX "Category_createdById_name_key" ON "Category"("createdById", "name");

-- CreateIndex
CREATE UNIQUE INDEX "Product_createdById_sku_key" ON "Product"("createdById", "sku");
