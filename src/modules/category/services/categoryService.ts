import { CreateCategoryDTO } from "../dtos/createCategoryDTO";
import { CategoryModel } from "../models/categoryModel";
import { CategoryRepository } from "../repository/categoryRepository";

export class CategoryService {
  private categoryRepository: CategoryRepository;

  constructor() {
    this.categoryRepository = new CategoryRepository();
  }

  async createCategory(
    data: CreateCategoryDTO,
  ): Promise<Pick<CategoryModel, "id" | "name">> {
    const create: CategoryModel = await this.categoryRepository.createCategory({
      createdById: data.createdById,
      name: data.name,
    });

    return { id: create.id, name: create.name };
  }
}
