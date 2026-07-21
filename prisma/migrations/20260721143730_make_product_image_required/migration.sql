/*
  Warnings:

  - Made the column `image` on table `Product` required. This step will fail if there are existing NULL values in that column.
  - Made the column `imageType` on table `Product` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Product" ALTER COLUMN "image" SET NOT NULL,
ALTER COLUMN "imageType" SET NOT NULL;
