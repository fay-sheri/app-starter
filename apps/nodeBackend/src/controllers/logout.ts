import type { Context, Next } from "koa";
import * as authService from "../services/authService.js";
import { AppError } from "../errors/index.js";

export async function logout(ctx: Context, next: Next) {
  const refreshToken = ctx.cookies.get("refresh_token");
  if (!refreshToken) {
    throw new AppError(401, 40102, "未登录");
  }
  await authService.logout(refreshToken);
  ctx.body = {
    code: 200,
    message: "成功登出",
    data: null,
  };
}
