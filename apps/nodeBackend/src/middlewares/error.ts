import type Koa from "koa";
import { AppError } from "../errors/index.js";

export function errorHandler(): Koa.Middleware {
  return async (ctx, next) => {
    try {
      await next();
    } catch (err: unknown) {
      // 先判断是不是 Error 实例
      if (!(err instanceof Error)) {
        ctx.status = 500;
        ctx.body = { code: "INTERNAL_ERROR", message: "未知错误", data: null };
        return;
      }

      if (err instanceof AppError) {
        if (err.statusCode >= 500) {
          console.error(err.message, err?.details);
          ctx.status = 500;
          ctx.body = {
            code: "500",
            message: "服务器内部错误",
            data: null,
          };
          return;
        }
        ctx.status = err.statusCode;
        ctx.body = { code: err.code, message: err.message, data: null };
        console.error(err.message, err?.details);
        return;
      }

      // pg 错误：pg 的 Error 上有 .code 属性
      if ("code" in err && typeof err.code === "string") {
        const pgErr = err;
        if (pgErr.code === "23505") {
          ctx.status = 409;
          ctx.body = { code: "CONFLICT", message: "数据已存在", data: null };
          return;
        }
      }

      // JWT 错误
      if (
        err.name === "JsonWebTokenError" ||
        err.name === "TokenExpiredError"
      ) {
        ctx.status = 401;
        ctx.body = {
          code: "INVALID_TOKEN",
          message: "身份凭证无效",
          data: null,
        };
        return;
      }

      // 兜底
      console.error(err);
      ctx.status = 500;
      ctx.body = {
        code: "INTERNAL_ERROR",
        message: "服务器内部错误",
        data: null,
      };
    }
  };
}
