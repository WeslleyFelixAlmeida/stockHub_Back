import { CreateCategoryDTO } from "../dtos/createCategoryDTO";
import { DeleteCategoryDTO } from "../dtos/deleteCategoryDTO";
import { UpdateCategoryNameDTO } from "../dtos/updateCategoryNameDTO";
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
  async updateCategoryName(
    data: UpdateCategoryNameDTO,
  ): Promise<Pick<CategoryModel, "id" | "name">> {
    const update: CategoryModel =
      await this.categoryRepository.updateCategoryName(data);

    return { id: update.id, name: update.name };
  }

  async deleteCategory(
    data: DeleteCategoryDTO,
  ): Promise<Pick<CategoryModel, "id" | "name">> {
    const deleteData: CategoryModel =
      await this.categoryRepository.deleteCategory(data);

    return { id: deleteData.id, name: deleteData.name };
  }
}
