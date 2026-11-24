import { z } from 'zod';

export const updateProfileSchema = z.object({
  name: z.string().min(1).max(64).optional(),
  role: z.string().max(128).nullable().optional(),
  bio: z.string().max(500).nullable().optional(),
  avatar: z.string().max(255).nullable().optional(),
  location: z.string().max(128).nullable().optional(),
  extras: z.record(z.string(),z.unknown()).optional(),
  skills: z.array(z.string().min(1).max(64)).max(20).optional(),
});

export type updateProfileType = z.infer<typeof updateProfileSchema>