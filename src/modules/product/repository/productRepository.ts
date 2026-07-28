import { Prisma } from "@prisma/client";
import { prisma } from "../../../connections/prisma";
import { DuplicateProductException } from "../exceptions/duplicateProductException";
import { ProductModel } from "../models/productModel";
import { ProductNotFoundException } from "../exceptions/productNotFoundException";

export class ProductRepository {
  async insertProduct(
    product: ProductModel,
  ): Promise<
    Omit<ProductModel, "createdAt" | "updatedAt" | "createdById" | "isActive">
  > {
    try {
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
          image: Uint8Array.from(product.image!),
          imageType: product.imageType!,
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
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === "P2002") {
          throw new DuplicateProductException();
        }
      }
      throw error;
    }
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
          createdById_sku: {
            sku: productDataUpdate.sku,
            createdById: productDataUpdate.createdById,
          },
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

  async getProducts(data: {
    userId: number;
    nextSKU?: string;
  }): Promise<Pick<ProductModel, "sku" | "stock" | "name">[]> {
    const products = await prisma.product.findMany({
      where: {
        createdById: data.userId,
      },
      select: {
        sku: true,
        stock: true,
        name: true,
      },
      take: 10,
      orderBy: {
        id: "desc",
      },

      ...(data.nextSKU && {
        cursor: {
          createdById_sku: {
            createdById: data.userId,
            sku: data.nextSKU,
          },
        },
        skip: 1,
      }),
    });

    return products;
  }

  async getProductData(data: {
    userId: number;
    sku: string;
  }): Promise<
    Omit<
      ProductModel,
      "createdById" | "updatedAt" | "createdAt" | "isActive" | "id"
    >
  > {
    const product = await prisma.product.findFirst({
      where: {
        createdById: data.userId,
        sku: data.sku,
      },
      omit: {
        createdById: true,
        updatedAt: true,
        createdAt: true,
        isActive: true,
      },
    });

    if (!product) {
      throw new ProductNotFoundException();
    }

    return {
      sku: product.sku,
      name: product.name,
      description: product.description ?? undefined,
      barcode: product.barcode ?? undefined,
      image: Buffer.from(product.image),
      imageType: product.imageType,
      purchasePrice: product.purchasePrice,
      salePrice: product.salePrice,
      stock: product.stock,
      minimumStock: product.minimumStock,
      unit: product.unit,
      supplierName: product.supplierName,
      categoryId: product.categoryId,
    };
  }

  async deleteProduct(data: {
    userId: number;
    sku: string;
  }): Promise<Pick<ProductModel, "sku">> {
    try {
      return await prisma.product.delete({
        where: {
          createdById_sku: {
            createdById: data.userId,
            sku: data.sku,
          },
        },
      });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === "P2025"
      ) {
        throw new ProductNotFoundException();
      }

      throw error;
    }
  }
}
