import type { Context, Next } from "koa";
import { AppError } from "../errors/index.js";
import * as worksService from "../services/worksService.js";
import type { GetWorksQuery } from "../schemas/works.js";

export async function getworks(ctx: Context, next: Next) {
  if (!ctx.state.validQueryParams) {
    throw new AppError(500, 500, "没有经过验证的查询参数数据");
  }
  const { worksPage } = await worksService.getWorks(ctx.state.validQueryParams as GetWorksQuery);
  ctx.body = {
    code: 200,
    message: "信息提供成功",
    data: worksPage
  }
}
