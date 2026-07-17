import { InsertProductDTO } from "../dtos/insertProductDTO";
import { ProductRepository } from "../repository/productRepository";

export class ProductService {
  private productRepository: ProductRepository;

  constructor() {
    this.productRepository = new ProductRepository();
  }

  async insertNewProduct(
    dto: InsertProductDTO,
  ): Promise<
    Omit<
      ProductModel,
      "createdAt" | "updatedAt" | "createdById" | "isActive" | "image"
    > & { image: string | null }
  > {
    
    let imageType: string | undefined;
    let base64Data = dto.image;

    if (dto.image.includes(",")) {
      const [header, data] = dto.image.split(",");

      // Extrai o tipo da imagem (ex.: image/png)
      imageType = header.match(/data:(.*);base64/)![1];

      base64Data = data;
    }

    const insertNewProduct: Omit<
      ProductModel,
      "createdAt" | "updatedAt" | "createdById" | "isActive"
    > = await this.productRepository.insertProduct({
      ...dto,
      image: Buffer.from(base64Data, "base64"),
      imageType,
      salePrice: dto.salePrice * 100, // Alterando para centavos os preços
      purchasePrice: dto.purchasePrice * 100, // Alterando para centavos os preços
      createdById: dto.createdById!,
    });

    const imageBase64 =
      insertNewProduct.image && insertNewProduct.imageType
        ? `data:${insertNewProduct.imageType};base64,${insertNewProduct.image.toString("base64")}`
        : null;

    return {
      ...insertNewProduct,
      image: imageBase64,
      salePrice: insertNewProduct.salePrice / 100,
      purchasePrice: insertNewProduct.purchasePrice / 100,
    };
  }
}
