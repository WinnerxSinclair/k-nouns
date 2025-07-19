import { z } from 'zod'
import { hex24 } from '../constants/zod/validation.js';
export const validateMongoId = (key) => {
  return z.strictObject({
    [key]: z.string().regex(hex24)
  });
}

