import type { Context, Next } from 'koa'
import type { ZodType } from 'zod'
import { AppError } from "../errors/index.js"

export function validateBody<T extends ZodType>(schema: T) {
  return async (ctx: Context, next: Next) => {
    const parsed = schema.safeParse(ctx.request.body)
    if (!parsed.success) {
      throw new AppError(
      422,
      42202,
      "参数缺失或格式错误",
      "请求体参数缺失或格式错误",
    );
    }
    ctx.state.validBody = parsed.data
    await next()
  }
}