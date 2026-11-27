import { z } from "zod";

export const getWorksQuerySchema = z.object({
  limit: z
    .string()
    .optional()
    .default("20")
    .transform((val) => {
      const num = Number(val);
      // 限制范围：1-50
      return Math.min(Math.max(num, 1), 50);
    }),
  cursor: z.string().optional(), //base64
});

export type GetWorksQuery = z.infer<typeof getWorksQuerySchema>;