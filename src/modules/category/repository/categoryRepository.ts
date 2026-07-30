import { Prisma } from "@prisma/client";
import { prisma } from "../../../connections/prisma";
import { CreateCategoryDTO } from "../dtos/createCategoryDTO";
import { DuplicateCategoryException } from "../exceptions/duplicateCategoryException";
import { UpdateCategoryNameDTO } from "../dtos/updateCategoryNameDTO";
import { CategoryModel } from "../models/categoryModel";
import { CategoryNotFoundException } from "../exceptions/categoryNotFoundException";
import { DeleteCategoryDTO } from "../dtos/deleteCategoryDTO";

export class CategoryRepository {
  async createCategory(
    data: CreateCategoryDTO,
  ): Promise<Pick<CategoryModel, "id" | "name">> {
    try {
      return await prisma.category.create({
        data: {
          name: data.name,
          createdById: data.createdById,
        },
        select: {
          id: true,
          name: true,
        },
      });
    } catch (error: any) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === "P2002"
      ) {
        throw new DuplicateCategoryException();
      }
      throw new Error(error);
    }
  }

  private async checkOwner(data: Pick<CategoryModel, "id" | "createdById">) {
    const checkOwner = await prisma.category.findFirst({
      where: {
        id: data.id,
        createdById: data.createdById,
      },
    });

    if (!checkOwner) {
      throw new CategoryNotFoundException();
    }

    return null;
  }

  async updateCategoryName(
    data: UpdateCategoryNameDTO,
  ): Promise<Pick<CategoryModel, "id" | "name">> {
    await this.checkOwner({ createdById: data.createdById, id: data.id });

    try {
      return await prisma.category.update({
        where: {
          id: data.id,
        },
        data: {
          name: data.name,
        },
        select: {
          id: true,
          name: true,
        },
      });
    } catch (error: any) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === "P2002"
      ) {
        throw new DuplicateCategoryException();
      }
      throw new Error(error);
    }
  }

  async deleteCategory(
    data: DeleteCategoryDTO,
  ): Promise<Pick<CategoryModel, "id" | "name">> {
    await this.checkOwner({ createdById: data.createdById, id: data.id });

    try {
      return await prisma.category.delete({
        where: {
          id: data.id,
        },
        select: {
          id: true,
          name: true,
        },
      });
    } catch (error: any) {
      throw new Error(error);
    }
  }

  async getCategory(data: {
    createdById: number;
    categoryId: number;
  }): Promise<Pick<CategoryModel, "id" | "name">> {
    await this.checkOwner({
      createdById: data.createdById,
      id: data.categoryId,
    });

    const category = await prisma.category.findUnique({
      where: {
        id: data.categoryId,
      },
      select: {
        id: true,
        name: true,
      },
    });

    if (!category) {
      throw new CategoryNotFoundException();
    }

    return category;
  }

  async getCategories(data: {
    userId: number;
    nextId?: number;
  }): Promise<Pick<CategoryModel, "id" | "name">[]> {
    const categories = await prisma.category.findMany({
      where: {
        createdById: data.userId,
      },
      select: {
        id: true,
        name: true,
      },
      take: 10,
      orderBy: {
        id: "desc",
      },

      ...(data.nextId && {
        cursor: {
          id: data.nextId,
        },
        skip: 1,
      }),
    });

    return categories;
  }
}
