import { z } from 'zod'

export const LoginSchema = z.object({
  username: z.string(),
  password: z.string(),
})

export type LoginInput = z.infer<typeof LoginSchema>

export const RegisterSchema = z.object({
  username: z.string(),
  password: z.string(),
})

export type RegisterInput = z.infer<typeof RegisterSchema>