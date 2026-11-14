import jwt from "jsonwebtoken";
import type { SignOptions } from "jsonwebtoken";
import { AppError } from "../errors/index.js";

const SECRET = process.env.JWT_SECRET;
if (!SECRET) throw new Error("JWT_SECRET 没配");

export interface AccessClaims {
  sub: string; //id
  username: string;
  iat?: number; //签发时间
  exp?: number; //过期时间
}

type Expiry = SignOptions["expiresIn"];

export function signAccessToken(
  userId: bigint | number | string,
  username: string,
): string {
  return jwt.sign({ sub: String(userId), username }, SECRET!, {
    algorithm: "HS256",
    expiresIn: "30m" as Expiry,
  });
}

export function verifyAccessToken(token: string): AccessClaims {
  return jwt.verify(token, SECRET!, {
    algorithms: ["HS256"],
  }) as unknown as AccessClaims;
}

import crypto from "crypto";

export function generateRefreshToken(): string {
  //64字符
  let refreshToken: string;
  try {
    refreshToken = crypto.randomBytes(32).toString('hex');
  } catch  {
    throw new AppError(500, 500, "生成刷新令牌失败");
  }
  return refreshToken;
}