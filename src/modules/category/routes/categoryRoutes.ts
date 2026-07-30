import { Router } from "express";
import { categoryController } from "../controllers/categoryController";
import { categoryMiddleware } from "../middlewares/categoryMiddleware";
import { userMiddleware } from "../../user/middlewares/userMiddleware";

const categoryRoutes = Router();

categoryRoutes.post(
  "/create",
  userMiddleware.authMiddleware.bind(userMiddleware),
  categoryMiddleware.createCategoryMiddleware.bind(categoryMiddleware),
  categoryController.createCategory.bind(categoryController),
);

categoryRoutes.patch(
  "/update/name/:id",
  userMiddleware.authMiddleware.bind(userMiddleware),
  categoryMiddleware.updateCategoryNameMiddleware.bind(categoryMiddleware),
  categoryController.updateCategoryName.bind(categoryController),
);

categoryRoutes.delete(
  "/delete/:id",
  userMiddleware.authMiddleware.bind(userMiddleware),
  categoryMiddleware.deleteCategoryMiddleware.bind(categoryMiddleware),
  categoryController.deleteCategory.bind(categoryController),
);

categoryRoutes.get(
  "/",
  userMiddleware.authMiddleware.bind(userMiddleware),
  categoryController.getCategories.bind(categoryController),
);

categoryRoutes.get(
  "/categoryData/:id",
  userMiddleware.authMiddleware.bind(userMiddleware),
  categoryMiddleware.getCategoryDataMiddleware.bind(categoryMiddleware),
  categoryController.getCategoryData.bind(categoryController),
);

export default categoryRoutes;
