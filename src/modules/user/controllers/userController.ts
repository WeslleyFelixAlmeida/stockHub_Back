import { env } from "node:process";
import { Request, Response } from "express";
import { UserService } from "../services/userService";
import { InvalidCredentialsException } from "../exceptions/invalidCredentialsException";
import jwt from "jsonwebtoken";
import { v4 as uuid } from "uuid";
import { DuplicateUserException } from "../exceptions/duplicateUserException";

class UserController {
  private userService: UserService;
  constructor() {
    this.userService = new UserService();
  }

  async registerUser(req: Request, res: Response) {
    try {
      const data = req.body;

      const register = await this.userService.registerUser({
        email: data.email,
        name: data.username,
        password: data.password,
      });

      return res.status(201).json({ message: "Usuário criado com sucesso!" });
    } catch (error) {
      if (error instanceof DuplicateUserException) {
        return res.status(409).json({ message: error.message });
      }

      return res.status(500).json({ message: "Ocorreu um erro no servidor" });
    }
  }

  async storeRefreshToken(data: { token: string; userId: number }) {
    const store = await this.userService.storeRefreshToken({
      token: data.token,
      userId: data.userId,
    });
  }

  async logout(req: Request, res: Response) {
    const refreshToken = req.cookies.refresh_token;
    const logout = await this.userService.logout({ token: refreshToken });
    res.clearCookie("auth_token");
    res.clearCookie("refresh_token");
    return res.status(200).json("logout realizado!");
  }

  async login(req: Request, res: Response) {
    try {
      const data = req.body;

      const login = await this.userService.login({
        email: data.email,
        password: data.password,
      });

      const { accessToken, refreshToken } = await this.createTokens({
        id: login.id!,
        email: login.email!,
      });

      await this.auth({
        res: res,
        accessToken: accessToken,
        refreshToken: refreshToken,
        userId: login.id!,
      });

      return res.status(200).json("login realizado!");
    } catch (error: any) {
      if (error instanceof InvalidCredentialsException) {
        return res.status(401).json({ message: "Credenciais inválidas" });
      }
      return res.status(500).json({ message: "Ocorreu um erro no servidor" });
    }
  }

  private async createTokens(data: { id: number; email: string }) {
    const accessToken = jwt.sign(
      {
        email: data.email,
      },
      env.JWT_SECRET!,
      {
        subject: String(data.id),
        expiresIn: "15m",
      },
    );

    const refreshToken = uuid();

    return {
      accessToken: accessToken,
      refreshToken: refreshToken,
    };
  }

  private async auth(data: {
    res: Response;
    accessToken: string;
    refreshToken: string;
    userId: number;
  }) {
    this.storeRefreshToken({
      token: data.refreshToken,
      userId: Number(data.userId),
    });

    data.res.cookie("auth_token", data.accessToken, {
      httpOnly: true,
      secure: env.NODE_ENV === "production", // em produção deve ser true
      sameSite: "strict",
    });

    data.res.cookie("refresh_token", data.refreshToken, {
      httpOnly: true,
      secure: env.NODE_ENV === "production", // em produção deve ser true
      sameSite: "strict",
    });
  }

  async getNewToken(req: Request, res: Response) {
    try {
      const validate = await this.userService.checkTokenAndUserData({
        token: req.cookies.refresh_token,
      });

      const { accessToken, refreshToken } = await this.createTokens({
        id: validate.id!,
        email: validate.email!,
      });

      await this.auth({
        res: res,
        accessToken: accessToken,
        refreshToken: refreshToken,
        userId: validate.id!,
      });

      return res.status(200).json("Revalidação concluída");
    } catch (error: any) {
      if (error instanceof InvalidCredentialsException) {
        return res.status(401).json({ message: "Credenciais inválidas" });
      }
      return res.status(500).json({ message: "Ocorreu um erro no servidor" });
    }
  }

  async getUserData(req: Request, res: Response) {
    try {
      const userTokenData = req.user!;
      const userData = await this.userService.getUserData({
        email: userTokenData.email,
      });

      return res.status(200).json({ data: userData });
    } catch (error: any) {
      return res.status(500).json({ message: "Ocorreu um erro no servidor" });
    }
  }

  async deleteAccount(req: Request, res: Response) {
    try {
      const refresh_token = req.cookies.auth_token;
      const userTokenData = req.user!;
      const data = req.body;

      const deleteAcc = await this.userService.deleteAccount({
        userId: userTokenData.id,
        password: data.password,
      });

      await this.userService.logout({ token: refresh_token });

      res.clearCookie("auth_token");
      res.clearCookie("refresh_token");
      return res.status(200).json({ message: "Conta deletada com sucesso" });
    } catch (error: any) {
      if (error instanceof InvalidCredentialsException) {
        return res.status(401).json({ message: "Credenciais inválidas" });
      }
      return res.status(500).json({ message: "Ocorreu um erro no servidor" });
    }
  }

  async updatePassword(req: Request, res: Response) {
    try {
      const userTokenData = req.user!;
      const data = req.body;

      const updatePassword = await this.userService.updatePassword({
        userId: userTokenData.id,
        oldPassword: data.oldPassword,
        newPassword: data.newPassword,
      });

      return res.status(200).json({ message: "Senha alterada com sucesso!" });
    } catch (error: any) {
      if (error instanceof InvalidCredentialsException) {
        return res.status(401).json({ message: "Credenciais inválidas" });
      }
      return res.status(500).json({ message: "Ocorreu um erro no servidor" });
    }
  }

  async updateUsername(req: Request, res: Response) {
    try {
      const userTokenData = req.user!;
      const data = req.body;

      const updateUsername = await this.userService.updateUsername({
        userId: userTokenData.id,
        newUsername: data.newUsername,
      });

      return res
        .status(200)
        .json({ message: "Nome de usuário alterado com sucesso!" });
    } catch (error: any) {
      if (error instanceof InvalidCredentialsException) {
        return res.status(401).json({ message: "Credenciais inválidas" });
      }
      return res.status(500).json({ message: "Ocorreu um erro no servidor" });
    }
  }
}

export const userController = new UserController();
