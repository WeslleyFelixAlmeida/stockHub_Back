import { Request, Response } from "express";
import { CategoryService } from "../services/categoryService";
import { DuplicateCategoryException } from "../exceptions/duplicateCategoryException";
import { CreateCategoryDTO } from "../dtos/createCategoryDTO";
import { UpdateCategoryNameDTO } from "../dtos/updateCategoryNameDTO";
import { DeleteCategoryDTO } from "../dtos/deleteCategoryDTO";
import { CategoryNotFoundException } from "../exceptions/categoryNotFoundException";

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

  async updateCategoryName(req: Request, res: Response) {
    try {
      const credentials = req.user!;

      const dto: UpdateCategoryNameDTO = {
        ...req.body,
        createdById: credentials.id,
      };

      const update = await this.categoryService.updateCategoryName(dto);

      return res
        .status(200)
        .json({ message: "Categoria atualizada com sucesso", data: update });
    } catch (error: any) {
      if (error instanceof DuplicateCategoryException) {
        return res
          .status(409)
          .json({ message: "Erro, categoria já adicionada" });
      }

      if (error instanceof CategoryNotFoundException) {
        return res
          .status(404)
          .json({ message: "Erro, categoria não encontrada" });
      }

      return res.status(500).json({ message: "Ocorreu um erro no servidor" });
    }
  }
  async deleteCategory(req: Request, res: Response) {
    try {
      const credentials = req.user!;

      const dto: DeleteCategoryDTO = {
        ...req.body,
        createdById: credentials.id,
      };

      const deleteData = await this.categoryService.deleteCategory(dto);

      return res
        .status(200)
        .json({ message: "Categoria deletada com sucesso", data: deleteData });
    } catch (error: any) {

      if (error instanceof CategoryNotFoundException) {
        return res
          .status(404)
          .json({ message: "Erro, categoria não encontrada" });
      }
      
      console.log(error)
      return res.status(500).json({ message: "Ocorreu um erro no servidor" });
    }
  }
}

export const categoryController = new CategoryController();
