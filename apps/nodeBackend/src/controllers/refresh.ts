import type { Context, Next } from "koa";
import * as authService from "../services/authService.js";
import { AppError } from "../errors/index.js";

export async function refresh(ctx: Context, next: Next) {
  const refreshToken = ctx.cookies.get("refresh_token");
  if (!refreshToken) {
    throw new AppError(401, 40102, "未登录");
  }
  const result = await authService.refresh(refreshToken);
  ctx.cookies.set('refresh_token', result.newRefreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/api/auth',
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
  ctx.body = {
    code: 200,
    message: "成功响应",
    data: {
        accesstoken: result.newAccessToken,
        expiresIn: 0
    }
}
}
