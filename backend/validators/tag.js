import { z } from 'zod'

export const tagNameSchemaParams = z.strictObject({
  tagName: z.string().trim().min(1).max(50)
});

export const tagNameSchemaBody = z.strictObject({
  newName: z.string().trim().min(1).max(50)
});



//USER TAGS
