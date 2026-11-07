import 'koa'

declare module 'koa' {
  interface DefaultState {
    userId?: number
    user?: { id: number; username: string }
    validBody?: unknown
  }
}