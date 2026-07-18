import { Request, Response } from "express";
import { ProductService } from "../services/productService";
import { InsertProductDTO } from "../dtos/insertProductDTO";
import { UpdateProductDTO } from "../dtos/updateProductDTO";

class ProductController {
  private productService: ProductService;
  constructor() {
    this.productService = new ProductService();
  }

  async insertNewProduct(req: Request, res: Response) {
    try {
      const userTokenData = req.user!;
      const dto: InsertProductDTO = req.body;

      const insertNewProduct = await this.productService.insertNewProduct({
        ...dto,
        createdById: userTokenData.id,
      });

      res.status(201).json({
        message: "Produto adicionado com sucesso!",
        data: insertNewProduct,
      });
    } catch (error: any) {
      console.log(error);

      return res.status(500).json({ message: "Ocorreu um erro no servidor" });
    }
  }

  async updateProduct(req: Request, res: Response) {
    try {
      const userTokenData = req.user!;
      const dto: UpdateProductDTO = req.body;
      const sku = req.params.sku as string;

      const updateProduct = await this.productService.updateProduct({
        ...dto,
        sku: sku,
        createdById: userTokenData.id,
      });

      res.status(200).json({
        message: "Informações alteradas com sucesso!",
        data: {
          sku: updateProduct.sku,
          changedValues: updateProduct.changedValues,
        },
      });
    } catch (error: any) {
      console.log(error);

      return res.status(500).json({ message: "Ocorreu um erro no servidor" });
    }
  }
}

export const productController = new ProductController();
