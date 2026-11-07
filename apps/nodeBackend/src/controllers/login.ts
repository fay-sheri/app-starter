import type { Context, Next } from "koa";
import { LoginSchema } from "../schemas/auth.js";
import type { LoginInput } from "../schemas/auth.js";
async function login(ctx: Context, next: Next) {
  const parsed = LoginSchema.safeParse(ctx.request.body);
  if (!parsed.success) {
    ctx.status = 422;
    ctx.body = {
      error: "validation_failed",
    };
    return;
  }
  const { username, password }: LoginInput = parsed.data   // 已校验 + 有类型
  const result = await authService.login(username, password)
  ctx.body = result
}
