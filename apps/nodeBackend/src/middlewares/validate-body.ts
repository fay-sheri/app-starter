import type { Context, Next } from 'koa'
import type { ZodType } from 'zod'

export function validateBody<T extends ZodType>(schema: T) {
  return async (ctx: Context, next: Next) => {
    const parsed = schema.safeParse(ctx.request.body)
    if (!parsed.success) {
      ctx.throw(422, '', { issues: parsed.error.issues })
    }
    ctx.state.validBody = parsed.data
    await next()
  }
}