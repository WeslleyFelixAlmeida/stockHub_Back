import { Router } from "express";
import { userController } from "../controllers/userController";
import { userMiddleware } from "../middlewares/userMiddleware";

const userRoutes = Router();

userRoutes.post(
  "/register",
  userMiddleware.registerUserMiddleware.bind(userMiddleware),
  userController.registerUser.bind(userController),
);

userRoutes.post(
  "/login",
  userMiddleware.loginUserMiddleware.bind(userMiddleware),
  userController.login.bind(userController),
);

userRoutes.get(
  "/logout",
  userMiddleware.refreshTokenMiddleware.bind(userMiddleware),
  userController.logout.bind(userController),
);

userRoutes.get(
  "/",
  userMiddleware.authMiddleware.bind(userMiddleware),
  userController.getUserData.bind(userController),
);

userRoutes.get(
  "/revalidateSession",
  userMiddleware.refreshTokenMiddleware.bind(userMiddleware),
  userController.getNewToken.bind(userController),
);

userRoutes.delete(
  "/delete",
  userMiddleware.authMiddleware.bind(userMiddleware),
  userMiddleware.deleteAccountMiddleware.bind(userMiddleware),
  userController.deleteAccount.bind(userController),
);

userRoutes.patch(
  "/update/password",
  userMiddleware.authMiddleware.bind(userMiddleware),
  userMiddleware.updatePasswordMiddleware.bind(userMiddleware),
  userController.updatePassword.bind(userController),
);

userRoutes.patch(
  "/update/username",
  userMiddleware.authMiddleware.bind(userMiddleware),
  userMiddleware.updateUsernameMiddleware.bind(userMiddleware),
  userController.updateUsername.bind(userController),
);

export default userRoutes;
