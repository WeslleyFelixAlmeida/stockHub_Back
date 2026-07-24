import { Request, Response } from "express";
import { CategoryService } from "../services/categoryService";
import { DuplicateCategoryException } from "../exceptions/duplicateCategoryException";
import { CreateCategoryDTO } from "../dtos/createCategoryDTO";

class CategoryController {
  private categoryService: CategoryService;

  constructor() {
    this.categoryService = new CategoryService();
  }

  async createCategory(req: Request, res: Response) {
    try {
      const credentials = req.user!;
      const dto: CreateCategoryDTO = req.body;

      const create = await this.categoryService.createCategory({
        createdById: credentials.id,
        name: dto.name,
      });
      
      return res
        .status(201)
        .json({ message: "Categoria criada com sucesso", data: create });
    } catch (error: any) {
      if (error instanceof DuplicateCategoryException) {
        return res
          .status(409)
          .json({ message: "Erro, categoria já adicionada" });
      }
      return res.status(500).json({ message: "Ocorreu um erro no servidor" });
    }
  }
}

export const categoryController = new CategoryController();
