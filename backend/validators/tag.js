import { z } from 'zod'
import { TAG_MAX_LEN } from '../../shared/constants/zod/validation.js';
export const tagNameSchemaParams = z.strictObject({
  tagName: z.string().trim().min(1).max(TAG_MAX_LEN)
});

export const tagNameSchemaBody = z.strictObject({
  newName: z.string().trim().min(1).max(TAG_MAX_LEN)
});



//USER TAGS
