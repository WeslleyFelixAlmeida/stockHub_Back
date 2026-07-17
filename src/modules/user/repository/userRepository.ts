import { RegisterDTO } from "../dtos/user/registerDTO";
import { prisma } from "../../../connections/prisma";
import { InvalidCredentialsException } from "../../../exceptions/invalidCredentialsException";
import { redis } from "../../../connections/redis";
import { Prisma } from "@prisma/client";
import { DuplicateUserException } from "../../../exceptions/duplicateUserException";

export class UserRepository {
  async registerUser(data: RegisterDTO) {
    try {
      return await prisma.user.create({
        data: {
          name: data.name,
          email: data.email,
          password: data.password,
        },
      });
    } catch (error: any) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === "P2002"
      ) {
        throw new DuplicateUserException();
      }
      throw new Error(error);
    }
  }

  async getUserInfoByEmail(data: { email: string }) {
    try {
      return await prisma.user.findUnique({
        where: { email: data.email },
        select: {
          id: true,
          name: true,
          email: true,
          password: true,
        },
      });
    } catch (error: any) {
      throw new Error(error);
    }
  }

  async getUserInfoById(data: { id: number }) {
    try {
      return await prisma.user.findUnique({
        where: { id: data.id },
        select: {
          id: true,
          name: true,
          email: true,
          password: true,
        },
      });
    } catch (error: any) {
      throw new Error(error);
    }
  }

  async storeRefreshToken(data: { token: string; userId: number }) {
    try {
      await redis.set(`refresh_token:${data.token}`, String(data.userId), {
        EX: 60 * 60 * 24 * 7,
      });
    } catch (error: any) {
      throw new Error(error);
    }
  }

  async logout(data: { token: string }) {
    try {
      await this.removeRefreshToken({ token: data.token });
    } catch (error: any) {
      throw new Error(error);
    }
  }

  async removeRefreshToken(data: { token: string }) {
    await redis.del(`refresh_token:${data.token}`);
  }

  async getUserIdByRedis(data: { token: string }) {
    try {
      const tokenData = await redis.get(`refresh_token:${data.token}`);
      if (!tokenData) {
        throw new InvalidCredentialsException();
      }
      return { userId: Number(tokenData) };
    } catch (error: any) {
      throw new Error(error);
    }
  }

  async updateUsername(data: { newUsername: string; userId: number }) {
    try {
      return await prisma.user.update({
        data: { name: data.newUsername },
        where: { id: data.userId },
        select: {
          id: true,
          name: true,
          email: true,
          password: true,
        },
      });
    } catch (error: any) {
      throw new Error(error);
    }
  }

  async updatePassword(data: { newPassword: string; userId: number }) {
    try {
      return await prisma.user.update({
        data: { password: data.newPassword },
        where: { id: data.userId },
        select: {
          id: true,
          name: true,
          email: true,
          password: true,
        },
      });
    } catch (error: any) {
      throw new Error(error);
    }
  }
  async deleteAccount(data: { userId: number }) {
    try {
      return await prisma.user.delete({
        where: { id: data.userId },
        select: {
          id: true,
        },
      });
    } catch (error: any) {
      throw new Error(error);
    }
  }
}
