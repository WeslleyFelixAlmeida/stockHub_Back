import { Request, Response } from "express";
import { ProductService } from "../services/productService";
import { InsertProductDTO } from "../dtos/insertProductDTO";

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
      return res.status(500).json({ message: "Ocorreu um erro no servidor" });
    }
  }
}

export const productController = new ProductController();
