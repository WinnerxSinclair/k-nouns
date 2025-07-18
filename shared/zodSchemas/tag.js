import { z } from 'zod'
import { TAG_MIN_LEN, TAG_MAX_LEN } from '../constants/zod/validation';
export const tagSchema = z.strictObject({
  tag: z.string().trim().min(TAG_MIN_LEN).max(TAG_MAX_LEN)
});