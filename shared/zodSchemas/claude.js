import { z } from 'zod'
import { FRONT_MAX_LEN, CONTEXT_MAX_LEN, BACK_MAX_LEN } from '../constants/zod/validation';
export const translateSchema = z.strictObject({
  context: z.string().trim().max(CONTEXT_MAX_LEN).optional(),
  front:   z.string().trim().min(1).max(FRONT_MAX_LEN)
});

export const explainSchema = z.strictObject({
  back: z.string().trim().min(1).max(BACK_MAX_LEN)
});