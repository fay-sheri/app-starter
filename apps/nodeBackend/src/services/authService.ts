import type { LoginInput } from "../schemas/auth.js";
import { verifyPassword, hashPassword } from "../utils/password.js";
import { signAccessToken } from "../utils/jwt.js";
import * as userRepository from "../repositories/users.js";
import { AppError } from "../errors/index.js";

export async function login({ username, password }: LoginInput) {
  const user = await userRepository.findUserByUsername(username);
  if (!user) {
    throw new AppError(404, "USER_NOT_FOUND", "用户不存在");
  }
    
  const hashed_password = user.password_hash;
  if (!(await verifyPassword(password, hashed_password))) {
    throw new AppError(401, "INVALID_PASSWORD", "密码错误");
  }
  return {
    code: 200,
    message: "登录成功",
    data: {
      token: signAccessToken(user.id, user.username),
      userInfo: {
        id: user.id,
        username: user.username,
      },
    },
  };
}
export async function register({ username, password }: LoginInput) {
  const user = await userRepository.findUserByUsername(username);
  if (user) {
    throw new AppError(409, "USER_ALREADY_EXISTS", "用户已存在");
  }
  let passwordHash: string;
  let newUser: Omit<userRepository.User, "password_hash">;
  try {
    passwordHash = await hashPassword(password);
  } catch (err) {
    throw new AppError(500, "HASH_PASSWORD_FAILED", "密码加密失败");
  }
  try {
    newUser = await userRepository.createUser(username, passwordHash);
  } catch (err) {
    throw new AppError(500, "CREATE_USER_FAILED", "创建用户失败");
  }
  return {
    code: 200,
    message: "注册成功",
    data: {
      userId: newUser.id,
      username: newUser.username,
    },
  };
}
