import type { Context, Next } from "koa";
import { LoginSchema } from "../schemas/auth.js";
import type { LoginInput } from "../schemas/auth.js";
import * as authService from "../services/authService.js"
export async function login(ctx: Context, next: Next) {
  const parsed = LoginSchema.safeParse(ctx.request.body);
  if (!parsed.success) {
    ctx.status = 422;
    ctx.body = {
      error: "validation_failed",
    };
    return;
  }   
  const result = await authService.login(parsed.data)
  ctx.body = result
}
