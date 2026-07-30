import { InvalidCredentialsException } from "../../user/exceptions/invalidCredentialsException";
import { UserModel } from "../../user/models/userModel";
import { UserRepository } from "../../user/repository/userRepository";
import { CreateCategoryDTO } from "../dtos/createCategoryDTO";
import { DeleteCategoryDTO } from "../dtos/deleteCategoryDTO";
import { GetCategoriesDTO, GetCategoryDTO } from "../dtos/getCategoriesDTO";
import { UpdateCategoryNameDTO } from "../dtos/updateCategoryNameDTO";
import { CategoryModel } from "../models/categoryModel";
import { CategoryRepository } from "../repository/categoryRepository";

type UserTypeReturn<T> = Omit<T, "createdAt" | "updatedAt">;

export class CategoryService {
  private categoryRepository: CategoryRepository;
  private userRepository: UserRepository;

  constructor() {
    this.categoryRepository = new CategoryRepository();
    this.userRepository = new UserRepository();
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

  private async getUserData(data: {
    userId: number;
  }): Promise<UserTypeReturn<UserModel>> {
    return await this.userRepository.getUserInfoById({ id: data.userId });
  }

  async getCategory(data: {
    userId: number;
    categoryId: number;
  }): Promise<Pick<GetCategoryDTO, "id" | "name">> {
    const categoryData: CategoryModel =
      await this.categoryRepository.getCategory({
        createdById: data.userId,
        categoryId: data.categoryId,
      });

    return { id: categoryData.id!, name: categoryData.name };
  }

  async getCategories(data: {
    userId: number;
    nextId?: number;
  }): Promise<GetCategoriesDTO> {
    const categoriesData: Pick<CategoryModel, "id" | "name">[] =
      await this.categoryRepository.getCategories({
        userId: data.userId,
        ...(data.nextId !== -1 && {
          nextId: data.nextId,
        }),
      });

    if (categoriesData.length > 10) {
      return {
        categoriesData: categoriesData,
        paginationData: {
          nextId: categoriesData[10].id,
          hasNext: true,
        },
      };
    }

    return {
      categoriesData: categoriesData,
      paginationData: {
        hasNext: false,
      },
    };
  }
}
