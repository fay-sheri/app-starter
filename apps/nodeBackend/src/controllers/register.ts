import type { Context, Next } from "koa";
import type { LoginInput } from "../schemas/auth.js";
import * as authService from "../services/authService.js";
import { AppError } from "../errors/index.js";

export async function register(ctx: Context, next: Next) {
  if (!ctx.state.validBody) {
    throw new AppError(500, 500, "没有经过验证的请求体数据");
  }
  const result = await authService.register(ctx.state.validBody as LoginInput);
  ctx.body = {
    code: 200,
    message: "注册成功",
    data: {
      userId: result.newUser.id,
      username: result.newUser.username,
    },
  };
}
