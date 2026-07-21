import { NextFunction, Request, Response } from "express";
import { insertNewProductSchema } from "../schemas/insertNewProductSchema";
import { ZodError } from "zod";
import {
  updateProductParamsSchema,
  updateProductSchema,
} from "../schemas/updateProductSchema";
import { getProductsSchema } from "../schemas/getProductsSchema";
import { getProductSchema } from "../schemas/getProductSchema";
import { deleteProductSchema } from "../schemas/deleteProductSchema";

class ProductMiddleware {
  async insertNewProductMiddleware(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const validate = insertNewProductSchema.parse(req.body);
      req.body = validate;

      next();
    } catch (error: any) {
      if (error instanceof ZodError) {
        console.log(error);
        return res.status(400).json({ message: "Dados inválidos" });
      }

      console.log(error);
      return res.status(500).json({ message: "Ocorreu um erro no servidor" });
    }
  }

  async updateProductMiddleware(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      if (req.body.sku) {
        return res.status(403).json({
          message: "O SKU do produto não pode ser alterado",
        });
      }

      req.params = updateProductParamsSchema.parse(req.params);
      req.body = updateProductSchema.parse(req.body);

      next();
    } catch (error: any) {
      if (error instanceof ZodError) {
        return res
          .status(400)
          .json({ message: "Dados inválidos", error: error.issues });
      }
      return res.status(500).json({ message: "Ocorreu um erro no servidor" });
    }
  }

  async getProductsMiddleware(req: Request, res: Response, next: NextFunction) {
    try {
      const validate = getProductsSchema.parse(req.query);
      req.productPagination = validate;

      next();
    } catch (error: any) {
      if (error instanceof ZodError) {
        return res
          .status(400)
          .json({ message: "Dados inválidos", error: error.issues });
      }
      return res.status(500).json({ message: "Ocorreu um erro no servidor" });
    }
  }

  async getProductDataMiddleware(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const validate = getProductSchema.parse(req.params);
      req.getProductData = validate;
      next();
    } catch (error: any) {
      if (error instanceof ZodError) {
        return res
          .status(400)
          .json({ message: "Dados inválidos", error: error.issues });
      }
      return res.status(500).json({ message: "Ocorreu um erro no servidor" });
    }
  }

  async deleteProductMiddleware(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const validate = deleteProductSchema.parse(req.params);

      req.params = validate;
      next();
    } catch (error: any) {
      if (error instanceof ZodError) {
        return res
          .status(400)
          .json({ message: "Dados inválidos", error: error.issues });
      }
      return res.status(500).json({ message: "Ocorreu um erro no servidor" });
    }
  }
}

export const productMiddleware = new ProductMiddleware();
