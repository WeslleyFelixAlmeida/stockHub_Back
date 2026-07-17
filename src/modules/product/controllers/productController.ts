import { env } from "node:process";
import { Request, Response } from "express";
import { ProductService } from "../services/productService";
import jwt, { JwtPayload } from "jsonwebtoken";
import { InsertProductDTO } from "../dtos/insertProductDTO";

class ProductController {
  private productService: ProductService;
  constructor() {
    this.productService = new ProductService();
  }

  private async getTokenData(data: { authToken: string }) {
    if (!env.JWT_SECRET) {
      throw new Error("JWT_SECRET não configurado");
    }

    const tokenData = jwt.verify(data.authToken, env.JWT_SECRET) as JwtPayload;
    return {
      id: Number(tokenData.sub),
      email: tokenData.email,
    };
  }

  async insertNewProduct(req: Request, res: Response) {
    try {
      const authToken = req.cookies.auth_token;
      const tokenData = await this.getTokenData({ authToken: authToken });
      const dto: InsertProductDTO = req.body;

      const insertNewProduct = await this.productService.insertNewProduct({
        ...dto,
        createdById: tokenData.id,
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
