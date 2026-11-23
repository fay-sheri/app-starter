import type { Context, Next } from "koa";
import { AppError } from "../errors/index.js";

export async function updateProfile(ctx: Context, next: Next){
    if (!ctx.state.validBody) {
        throw new AppError(500, 500, "没有经过验证的请求体数据");
    };
    
}