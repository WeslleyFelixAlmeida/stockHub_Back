import { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";
import { createCategorySchema } from "../schemas/createCategorySchema";
import { categoryParamsSchema } from "../schemas/categoryParamsSchema";
import { updateCategoryNameSchema } from "../schemas/updateCategorySchema";

class CategoryMiddleware {
  async createCategoryMiddleware(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const validate = createCategorySchema.parse(req.body);
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

  async updateCategoryNameMiddleware(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const validateParams = categoryParamsSchema.parse(req.params);
      const validatebody = updateCategoryNameSchema.parse(req.body);
      req.body = { ...validatebody, id: validateParams.id };

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

  async deleteCategoryMiddleware(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const validateParams = categoryParamsSchema.parse(req.params);
      req.body = { id: validateParams.id };

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

export const categoryMiddleware = new CategoryMiddleware();
