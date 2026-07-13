import { env } from "node:process";
import { AuthDTO } from "../dtos/user/authDTO";
import { RegisterDTO } from "../dtos/user/registerDTO";
import { InvalidCredentialsException } from "../../../exceptions/invalidCredentialsException";
import { UserModel } from "../models/userModel";
import { UserRepository } from "../repository/userRepository";
import bcrypt from "bcrypt";

export class UserService {
  private userRepository: UserRepository;
  private SALT_ROUNDS = 12;
  private DUMMY_HASH = env.DUMMY_HASH;

  constructor() {
    this.userRepository = new UserRepository();
  }

  private async hashPassword(password: string) {
    return bcrypt.hash(password, this.SALT_ROUNDS);
  }

  async registerUser(data: RegisterDTO) {
    const passwordHash = await this.hashPassword(data.password);

    const register = await this.userRepository.registerUser({
      email: data.email,
      name: data.name,
      password: passwordHash,
    });

    return register;
  }

  async login(data: AuthDTO) {
    const userData: UserModel | null =
      await this.userRepository.getUserInfoByEmail({
        email: data.email,
      });

    const passwordHash = userData?.password ?? this.DUMMY_HASH;

    const checkPassword = await bcrypt.compare(data.password, passwordHash!);

    if (!userData || !checkPassword) {
      throw new InvalidCredentialsException();
    }

    return { email: userData.email, id: userData.id };
  }

  async storeRefreshToken(data: { token: string; userId: number }) {
    await this.userRepository.storeRefreshToken({
      token: data.token,
      userId: data.userId,
    });
  }

  async logout(data: { token: string }) {
    await this.userRepository.logout({
      token: data.token,
    });
  }

  async getUserData(data: { email: string }) {
    const userData: UserModel | null =
      await this.userRepository.getUserInfoByEmail({
        email: data.email,
      });

    return { name: userData?.name, email: userData?.email };
  }

  async getUserDataById(data: { id: number }) {
    const userData: UserModel | null =
      await this.userRepository.getUserInfoById({
        id: data.id,
      });

    return { name: userData?.name, email: userData?.email, id: userData?.id };
  }

  async checkTokenAndUserData(data: { token: string }) {
    const userId = await this.userRepository.getUserIdByRedis({
      token: data.token,
    });

    const userData = await this.getUserDataById({ id: userId.userId });
    await this.userRepository.removeRefreshToken({ token: data.token });

    return userData;
  }

  async updateUsername(data: { userId: number; newUsername: string }) {
    const updateUsername: UserModel | null =
      await this.userRepository.updateUsername({
        newUsername: data.newUsername,
        userId: data.userId,
      });

    return { name: updateUsername?.name };
  }

  async updatePassword(data: {
    userId: number;
    oldPassword: string;
    newPassword: string;
  }) {
    const userData = await this.userRepository.getUserInfoById({
      id: data.userId,
    });
    const passwordHash = userData?.password ?? this.DUMMY_HASH;
    const checkPassword = await bcrypt.compare(data.oldPassword, passwordHash!);

    if (!userData || !checkPassword) {
      throw new InvalidCredentialsException();
    }

    const newPasswordHash = await this.hashPassword(data.newPassword);
    const updatePassword: UserModel | null =
      await this.userRepository.updatePassword({
        newPassword: newPasswordHash,
        userId: data.userId,
      });

    return updatePassword;
  }

  async deleteAccount(data: { password: string; userId: number }) {
    const userData = await this.userRepository.getUserInfoById({
      id: data.userId,
    });

    const passwordHash = userData?.password ?? this.DUMMY_HASH;
    const checkPassword = await bcrypt.compare(data.password, passwordHash!);
    if (!userData || !checkPassword) {
      throw new InvalidCredentialsException();
    }

    const deleteAccount = await this.userRepository.deleteAccount({
      userId: data.userId,
    });

    return deleteAccount;
  }
}
