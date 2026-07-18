import { Prisma } from "@prisma/client";
import { prisma } from "../../../connections/prisma";
import { DuplicateProductException } from "../../../exceptions/duplicateProductException";
import { ProductModel } from "../models/productModel";

export class ProductRepository {
  async insertProduct(
    product: ProductModel,
  ): Promise<
    Omit<ProductModel, "createdAt" | "updatedAt" | "createdById" | "isActive">
  > {
    const insert = await prisma.product.create({
      data: {
        name: product.name,
        createdById: product.createdById,
        purchasePrice: product.purchasePrice,
        salePrice: product.salePrice,
        sku: product.sku,
        supplierName: product.supplierName,
        unit: product.unit,
        barcode: product.barcode,
        categoryId: product.categoryId,
        description: product.description,
        minimumStock: product.minimumStock,
        stock: product.stock,
        image: product.image ? Uint8Array.from(product.image) : undefined,
        imageType: product.imageType ?? undefined,
      },
      omit: {
        createdById: true,
        updatedAt: true,
        createdAt: true,
        isActive: true,
      },
    });

    return {
      id: insert.id,
      sku: insert.sku,
      name: insert.name,
      description: insert.description ?? undefined,
      barcode: insert.barcode ?? undefined,
      image: insert.image ? Buffer.from(insert.image) : undefined,
      imageType: insert.imageType ?? undefined,
      purchasePrice: insert.purchasePrice,
      salePrice: insert.salePrice,
      stock: insert.stock,
      minimumStock: insert.minimumStock,
      unit: insert.unit,
      supplierName: insert.supplierName,
      categoryId: insert.categoryId,
    };
  }

  async updateProduct(
    productDataUpdate: Partial<Omit<ProductModel, "sku">> & {
      sku: string;
      createdById: number;
    },
  ): Promise<Pick<ProductModel, "sku">> {
    try {
      const updated = await prisma.product.update({
        where: {
          sku: productDataUpdate.sku,
          createdById: productDataUpdate.createdById,
        },
        data: {
          name: productDataUpdate.name,
          purchasePrice: productDataUpdate.purchasePrice,
          salePrice: productDataUpdate.salePrice,
          supplierName: productDataUpdate.supplierName,
          unit: productDataUpdate.unit,
          barcode: productDataUpdate.barcode,
          categoryId: productDataUpdate.categoryId,
          description: productDataUpdate.description,
          minimumStock: productDataUpdate.minimumStock,
          stock: productDataUpdate.stock,
          image: productDataUpdate.image
            ? Uint8Array.from(productDataUpdate.image)
            : undefined,
          imageType: productDataUpdate.imageType,
        },
        select: { sku: true },
      });

      return {
        sku: updated.sku,
      };
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === "P2002") {
          throw new DuplicateProductException();
        }
      }
      throw error;
    }
  }
}
