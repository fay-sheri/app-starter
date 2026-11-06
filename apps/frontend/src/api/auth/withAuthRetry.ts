import { api } from "../../lib/http";
import { refresh } from "./refresh";
import { TokenExpiredError } from "../../Error/auth/AuthError";
import type { InternalAxiosRequestConfig } from "axios";

export async function withAuthRetry<T>(fn: () => Promise<T>): Promise<T> {
  try {
    return await fn();
  } catch (err: unknown) {
    if (!(err instanceof TokenExpiredError)) throw err;
    const original = err.config as InternalAxiosRequestConfig;
    if (original.__retried) throw err;

    // 单飞刷新
    const newToken = await refresh();

    // 重放原请求（axios config 本身就是上下文）
    original.__retried = true;
    original.headers.Authorization = `Bearer ${newToken}`;

    return api(original) as unknown as Promise<T>;
  }
}
