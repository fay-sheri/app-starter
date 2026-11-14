import type { Context, Next } from "koa";
import { LoginSchema } from "../schemas/auth.js";
import * as authService from "../services/authService.js";
import { AppError } from "../errors/index.js";

export async function login(ctx: Context, next: Next) {
  const parsed = LoginSchema.safeParse(ctx.request.body);
  if (!parsed.success) {
    throw new AppError(
      422,
      42202,
      "参数缺失或格式错误",
      "请求体参数缺失或格式错误",
    );
  }
  const result = await authService.login(parsed.data);
  ctx.body = {
      code: 200,
      message: "登录成功",
      data: {
        token: result.token,
        userInfo: {
          id: result.user.id,
          username: result.user.username,
        },
      },
    };
}
