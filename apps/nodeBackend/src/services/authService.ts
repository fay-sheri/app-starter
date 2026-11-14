import type { LoginInput } from "../schemas/auth.js";
import { verifyPassword, hashPassword } from "../utils/password.js";
import { signAccessToken, generateRefreshToken } from "../utils/jwt.js";
import { decryptRSAPassword } from "../utils/rsa.js";
import * as userRepository from "../repositories/users.js";
import * as refreshRepository from "../repositories/refresh-token.js";
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
  const refreshToken = generateRefreshToken();
  try {
    await refreshRepository.saveRefreshToken(user.id, refreshToken);
  } catch {
    throw new AppError(500, 500, "保存刷新令牌失败");
  }
  return {
    user,
    token: signAccessToken(user.id, user.username),
    refreshToken,
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

export async function refresh(refreshToken: string) {
  const consumed = await refreshRepository.consumeRefreshToken(refreshToken); 
  if(!consumed){
    throw new AppError(401, 40102, '登录已失效，请重新登录');
  }
  const user = await userRepository.findUserById(consumed.user_id);
  if (!user) {
    throw new AppError(401, 40101, '用户不存在');
  }
  const newRefreshToken = generateRefreshToken();
  await refreshRepository.saveRefreshToken(user.id, newRefreshToken);
  const newAccessToken = signAccessToken(user.id, user.username);
  return {
    newRefreshToken,
    newAccessToken
  }
}