import { Router } from "express";
import { productController } from "../controllers/productController";
import { productMiddleware } from "../middlewares/productMiddleware";
import { userMiddleware } from "../../user/middlewares/userMiddleware";

const productRoutes = Router();

productRoutes.post(
  "/insert",
  userMiddleware.authMiddleware.bind(userMiddleware),
  productMiddleware.insertNewProductMiddleware.bind(productMiddleware),
  productController.insertNewProduct.bind(productController),
);

export default productRoutes;
