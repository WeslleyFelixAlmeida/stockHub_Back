import { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";
import { registerSchema } from "../schemas/user/registerSchema";
import { loginSchema } from "../schemas/user/loginSchema";
import { authSchema } from "../schemas/user/authSchema";
import { refreshTokenSchema } from "../schemas/user/refreshTokenSchema";
import jwt, { JwtPayload, TokenExpiredError } from "jsonwebtoken";
import { env } from "node:process";
import { updateUsernameSchema } from "../schemas/user/updateUsernameSchema";
import { updatePasswordSchema } from "../schemas/user/updatePasswordSchema";
import { deleteAccountSchema } from "../schemas/user/deleteAccountSchema";

class UserMiddleware {
  async registerUserMiddleware(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const validation = registerSchema.parse(req.body);

      next();
    } catch (error: any) {
      if (error instanceof ZodError) {
        return res
          .status(400)
          .json({ message: "Informações inválidas", error: error.issues });
      }
      return res.status(500).json({ message: "Ocorreu um erro no servidor" });
    }
  }

  async loginUserMiddleware(req: Request, res: Response, next: NextFunction) {
    try {
      const validation = loginSchema.parse(req.body);

      next();
    } catch (error: any) {
      if (error instanceof ZodError) {
        return res
          .status(400)
          .json({ message: "Informações inválidas", error: error.issues });
      }
      return res.status(500).json({ message: "Ocorreu um erro no servidor" });
    }
  }

  async authMiddleware(req: Request, res: Response, next: NextFunction) {
    // try {
    //   const auth_token = req.cookies.auth_token;
    //   if (!auth_token) {
    //     return res.status(401).json({ message: "Erro de autenticação" });
    //   }

    //   if (!env.JWT_SECRET) {
    //     return res.status(500).json({ message: "Ocorreu um erro no servidor" });
    //   }

    //   const tokenData = jwt.verify(auth_token, env.JWT_SECRET) as JwtPayload;

    //   const validation = authSchema.parse({
    //     auth_token: auth_token,
    //   });

    //   next();
    // } catch (error: any) {
    //   if (error instanceof ZodError) {
    //     return res
    //       .status(400)
    //       .json({ message: "Informações inválidas", error: error.issues });
    //   }

    //   if (error instanceof TokenExpiredError) {
    //     return res.status(401).json({ message: "Erro de autenticação" });
    //   }

    //   return res.status(500).json({ message: "Ocorreu um erro no servidor" });
    // }
  }

  async refreshTokenMiddleware(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    // try {
    //   const refresh_token = req.cookies.refresh_token;

    //   if (!refresh_token) {
    //     return res.status(401).json({ message: "Erro de autenticação" });
    //   }

    //   const validation = refreshTokenSchema.parse({
    //     refresh_token: refresh_token,
    //   });

    //   next();
    // } catch (error: any) {
    //   if (error instanceof ZodError) {
    //     return res
    //       .status(400)
    //       .json({ message: "Informações inválidas", error: error.issues });
    //   }
    //   return res.status(500).json({ message: "Ocorreu um erro no servidor" });
    // }
  }

  async updateUsernameMiddleware(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const validation = updateUsernameSchema.parse(req.body);

      next();
    } catch (error: any) {
      if (error instanceof ZodError) {
        return res
          .status(400)
          .json({ message: "Informações inválidas", error: error.issues });
      }
      return res.status(500).json({ message: "Ocorreu um erro no servidor" });
    }
  }

  async updatePasswordMiddleware(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const validation = updatePasswordSchema.parse(req.body);
      next();
    } catch (error: any) {
      if (error instanceof ZodError) {
        return res
          .status(400)
          .json({ message: "Informações inválidas", error: error.issues });
      }
      return res.status(500).json({ message: "Ocorreu um erro no servidor" });
    }
  }

  async deleteAccountMiddleware(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const validation = deleteAccountSchema.parse(req.body);
      next();
    } catch (error: any) {
      if (error instanceof ZodError) {
        return res
          .status(400)
          .json({ message: "Informações inválidas", error: error.issues });
      }
      return res.status(500).json({ message: "Ocorreu um erro no servidor" });
    }
  }
}

export const userMiddleware = new UserMiddleware();
