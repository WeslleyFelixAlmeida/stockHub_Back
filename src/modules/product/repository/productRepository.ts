import { prisma } from "../../../connections/prisma";

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
      // isActive: insert.isActive,
      // createdAt: insert.createdAt,
      // updatedAt: insert.updatedAt,
      // createdById: insert.createdById,
    };
  }
}
