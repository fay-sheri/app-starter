import type { InternalAxiosRequestConfig } from "axios";

export class TokenExpiredError extends Error {
  constructor(public config: InternalAxiosRequestConfig) {
    super("token expired");
    this.name = "TokenExpiredError";
  }
}
