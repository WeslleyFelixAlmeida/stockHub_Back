import { GetProductsDTO, PaginationInformations } from "../dtos/getProductDTO";
import { InsertProductDTO } from "../dtos/insertProductDTO";
import { UpdateProductDTO } from "../dtos/updateProductDTO";
import { ProductModel } from "../models/productModel";
import { ProductRepository } from "../repository/productRepository";

type ProductReturn<T> = Promise<
  Omit<T, "createdAt" | "updatedAt" | "createdById" | "isActive" | "image"> & {
    image: string;
  }
>;

export class ProductService {
  private productRepository: ProductRepository;

  constructor() {
    this.productRepository = new ProductRepository();
  }

  private convertImageToBuffer(imageData: { imageBase64: string }): {
    imageBuffer: Buffer;
    imageType: string;
  } {
    let base64Data = imageData.imageBase64;
    let imageType: string | undefined;

    if (imageData.imageBase64.includes(",")) {
      const [header, data] = imageData.imageBase64.split(",");
      imageType = header.match(/data:(.*);base64/)?.[1];
      base64Data = data;
    }

    return {
      imageBuffer: Buffer.from(base64Data, "base64"),
      imageType: imageType ? imageType : "",
    };
  }

  private convertImageToBase64(imageData: {
    imageBuffer: Buffer;
    imageType: string;
  }): string {
    return `data:${imageData.imageType};base64,${imageData.imageBuffer.toString("base64")}`;
  }

  async insertNewProduct(dto: InsertProductDTO): ProductReturn<ProductModel> {
    const { imageBuffer, imageType } = this.convertImageToBuffer({
      imageBase64: dto.image,
    });

    const insertNewProduct: Omit<
      ProductModel,
      "createdAt" | "updatedAt" | "createdById" | "isActive"
    > = await this.productRepository.insertProduct({
      ...dto,
      image: imageBuffer,
      imageType: imageType,
      createdById: dto.createdById,
      // Alterando o valor dos preços para centavos:
      salePrice: dto.salePrice * 100,
      purchasePrice: dto.purchasePrice * 100,
    });

    const imageBase64 = this.convertImageToBase64({
      imageBuffer: insertNewProduct.image!,
      imageType: insertNewProduct.imageType,
    });

    return {
      ...insertNewProduct,
      image: imageBase64,
      salePrice: insertNewProduct.salePrice / 100,
      purchasePrice: insertNewProduct.purchasePrice / 100,
    };
  }

  private getChangedFields(dto: UpdateProductDTO): Record<string, boolean> {
    const changedFields: Record<string, boolean> = {};
    const keys = Object.keys(dto);

    keys.forEach((key) => {
      if (key !== "sku" && key !== "createdById") {
        changedFields[key] = true;
      }
    });

    return changedFields;
  }

  async updateProduct(
    dto: UpdateProductDTO & { sku: string; createdById: number },
  ): Promise<
    Pick<ProductModel, "sku"> & { changedValues: Record<string, boolean> }
  > {
    const changedValues = this.getChangedFields(dto);

    let imageBuffer: Buffer | undefined;
    let imageType: string | undefined;

    if (dto.image) {
      const converted = this.convertImageToBuffer({ imageBase64: dto.image });
      imageBuffer = converted.imageBuffer;
      imageType = converted.imageType;
    }

    const purchasePrice =
      dto.purchasePrice !== undefined ? dto.purchasePrice * 100 : undefined;
    const salePrice =
      dto.salePrice !== undefined ? dto.salePrice * 100 : undefined;

    const updatedProduct: Pick<ProductModel, "sku"> =
      await this.productRepository.updateProduct({
        ...dto,
        image: imageBuffer,
        imageType,
        purchasePrice,
        salePrice,
        sku: dto.sku,
      });

    return { sku: updatedProduct.sku, changedValues: changedValues };
  }

  async getProducts(data: {
    userId: number;
    nextSKU?: string;
  }): Promise<GetProductsDTO> {
    const products = await this.productRepository.getProducts({
      userId: data.userId,
      nextSKU: data.nextSKU,
    });

    let paginationData: PaginationInformations;

    if (products.length > 10) {
      paginationData = { nextSKU: products[10].sku, hasNext: true };
      products.pop();
      return { productsData: products, paginationData: paginationData };
    }

    return { productsData: products, paginationData: { hasNext: false } };
  }

  async getProductData(data: {
    userId: number;
    sku: string;
  }): Promise<Omit<ProductReturn<ProductModel>, "imageType">> {
    const product = await this.productRepository.getProductData({
      userId: data.userId,
      sku: data.sku,
    });

    return {
      ...product,
      image: this.convertImageToBase64({
        imageBuffer: product.image!,
        imageType: product.imageType,
      }),
    };
  }

  async deleteProduct(data: {
    userId: number;
    sku: string;
  }): Promise<Pick<ProductModel, "sku">> {
    const product = await this.productRepository.deleteProduct({
      userId: data.userId,
      sku: data.sku,
    });

    return { sku: product.sku };
  }
}
