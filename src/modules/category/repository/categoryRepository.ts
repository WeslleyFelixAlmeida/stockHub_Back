import { Prisma } from "@prisma/client";
import { prisma } from "../../../connections/prisma";
import { CreateCategoryDTO } from "../dtos/createCategoryDTO";
import { DuplicateCategoryException } from "../exceptions/duplicateCategoryException";

export class CategoryRepository {
    async createCategory(data: CreateCategoryDTO) {
      try {
        return await prisma.category.create({
          data: {
            name: data.name,
            createdById: data.createdById
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
}
