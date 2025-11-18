import { z } from 'zod';

export const searchSchema = z.object({
  search: z.string().max(500).optional(),
  topics: z.array(z.string()).optional(),
  difficulty: z.array(z.string()).optional(),
  source: z.array(z.string()).optional(),
  publisher: z.array(z.string()).optional(),
  author: z.array(z.string()).optional(),
  ratingMin: z.number().min(0).max(5).optional().nullable(),
  ratingMax: z.number().min(0).max(5).optional().nullable(),
  dateFrom: z.string().optional().nullable(),
  dateTo: z.string().optional().nullable(),
});

export type SearchInput = z.infer<typeof searchSchema>;

