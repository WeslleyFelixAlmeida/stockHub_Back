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

productRoutes.patch(
  "/update/:sku",
  userMiddleware.authMiddleware.bind(userMiddleware),
  productMiddleware.updateProductMiddleware.bind(productMiddleware),
  productController.updateProduct.bind(productController),
);

productRoutes.get(
  "/",
  userMiddleware.authMiddleware.bind(userMiddleware),
  productMiddleware.getProductsMiddleware.bind(productMiddleware),
  productController.getProducts.bind(productController),
);

productRoutes.get(
  "/productData/:sku",
  userMiddleware.authMiddleware.bind(userMiddleware),
  productMiddleware.getProductDataMiddleware.bind(productMiddleware),
  productController.getProductData.bind(productController),
);

productRoutes.delete(
  "/delete/:sku",
  userMiddleware.authMiddleware.bind(userMiddleware),
  productMiddleware.deleteProductMiddleware.bind(productMiddleware),
  productController.deleteProduct.bind(productController),
);




export default productRoutes;
