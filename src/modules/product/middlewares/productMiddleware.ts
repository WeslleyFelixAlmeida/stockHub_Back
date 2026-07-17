import { NextFunction, Request, Response } from "express";
import { insertNewProductSchema } from "../schemas/insertNewProductSchema";
import { ZodError } from "zod";

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
}

export const productMiddleware = new ProductMiddleware();
