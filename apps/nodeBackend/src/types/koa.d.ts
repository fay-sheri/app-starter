import 'koa'

declare module 'koa' {
  interface DefaultState {
    // userId?: number
    verifyUser?: { id: string; username: string }
    validBody?: unknown
  }
}