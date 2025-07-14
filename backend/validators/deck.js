import { z } from 'zod'

export const createDeckSchema = z.strictObject({
  name: z.string().trim().min(1, 'name cant be empty').max(60, 'name too long')
});

export const deckIdSchema = z.strictObject({
  deckId: z.string().regex(/^[a-f\d]{24}$/i)
});

export const exportDeckSchema = z.strictObject({
  deckId: z.string().regex(/^[a-f\d]{24}$/i),
  mode: z.enum(['backup', 'share'])
});