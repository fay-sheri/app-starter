import type { LoginInput } from "../schemas/auth.js";
import { verifyPassword, hashPassword } from "../utils/password.js";
import { signAccessToken } from "../utils/jwt.js";
import { decryptRSAPassword } from "../utils/rsa.js";
import * as userRepository from "../repositories/users.js";
import { AppError } from "../errors/index.js";

export async function login({ username, password }: LoginInput) {
  const user = await userRepository.findUserByUsername(username);
  if (!user) {
    throw new AppError(404, 40101, "账号或密码错误", "用户不存在");
  }
  const plainPassword = decryptRSAPassword(password);
  const hashed_password = user.password_hash;
  if (!(await verifyPassword(plainPassword, hashed_password))) {
    throw new AppError(401, 40101, "账号或密码错误", "密码错误");
  }
  return {
    user,
    token: signAccessToken(user.id, user.username),
  };
}
export async function register({ username, password }: LoginInput) {
  const user = await userRepository.findUserByUsername(username);
  if (user) {
    throw new AppError(409, 40901, "用户已存在");
  }
  let plainPassword: string;
  let passwordHash: string;
  let newUser: Omit<userRepository.User, "password_hash">;
  try {
    plainPassword = decryptRSAPassword(password);
  } catch (err) {
    throw new AppError(422, 42201, "密码加密参数异常");
  }
  try {
    passwordHash = await hashPassword(plainPassword);
  } catch (err) {
    throw new AppError(500, 500, "密码加密失败");
  }
  try {
    newUser = await userRepository.createUser(username, passwordHash);
  } catch (err) {
    throw new AppError(500, 500, "创建用户失败");
  }
  return { newUser };
}
