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

export default categoryRoutes;
