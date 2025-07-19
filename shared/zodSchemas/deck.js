import { z } from 'zod'
import { hex24, DECK_MAX_LEN } from '../constants/zod/validation.js';
export const createDeckSchema = z.strictObject({
  name: z.string().trim().min(1, 'name cant be empty').max(DECK_MAX_LEN, 'name too long')
});


export const exportDeckSchema = z.strictObject({
  deckId: z.string().regex(hex24),
  mode: z.enum(['backup', 'share'])
});