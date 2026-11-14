export class AppError extends Error {
  constructor(
    public statusCode: number,
    public code: number,
    message: string,
    public details?: any
  ) {
    super(message);
    this.name = 'AppError';
  }
}