import type { Context, Next } from 'koa';
import { AppError } from '../errors/index.js';
import { verifyAccessToken } from "../utils/jwt.js"


export async function authMiddleware(ctx: Context, next: Next) {
  const authHeader = ctx.headers.authorization;
  if (!authHeader) {
    throw new AppError(401, 40102, '未登录', '缺少 Authorization 头');
  }
  if (!authHeader.startsWith('Bearer ')) {
    throw new AppError(401, 40102, '未登录', 'Authorization 格式错误，应为 Bearer <token>');
  }
  const token = authHeader.slice(7); 
  let payload: any;
  try {
    payload = verifyAccessToken(token);
  } catch (err: any) {
    if (err.name === 'TokenExpiredError') {
      throw new AppError(401, 40103, '登录已过期，请刷新', 'access token 已过期');
    }
    throw new AppError(401, 40102, '未登录', 'access token 无效');
  }
  ctx.state.user = {
    id: payload.userId,
    username: payload.username,
  };
  await next();
}