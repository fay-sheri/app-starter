import type { Context, Next } from 'koa'
import type { ZodType } from 'zod'
import { AppError } from "../errors/index.js"

export function validateQueryParams<T extends ZodType>(schema: T) {
  return async (ctx: Context, next: Next) => {
    const parsed = schema.safeParse(ctx.query)
    if (!parsed.success) {
      throw new AppError(
      422,
      42202,
      "参数缺失或格式错误",
      "请求体参数缺失或格式错误",
    );
    }
    ctx.state.validQueryParams = parsed.data
    await next()
  }
}