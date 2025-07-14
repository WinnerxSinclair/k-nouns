import * as z from "zod/v4";
const hex24 = /^[a-f\d]{24}$/i;

export const createCardSchema = z.strictObject({
  context: z.string().trim().max(200).optional(),
  front: z.string().trim().max(1500),
  back: z.string().trim().max(1500),
  explanation: z.string().trim().max(3000).optional(),
  mirror: z.boolean().default(false),
  tags: z.array(z.string().trim().min(1).max(50)).max(20).default([])
});

export const dashboardCardsSchema = z.strictObject({
  decks: z.array(z.string().regex(hex24)).max(100).default([]),
  tags: z.array(z.string().trim()).max(500).default([]),
  conditional: z.enum(['$in', '$all']).default('$in')
});

export const reviewCardsSchema = z.strictObject({
  want: z.number().default(10),
  decks: z.array(z.string().regex(hex24)).max(100).default([]),
  tags: z.array(z.string().trim()).max(500).default([]),
  conditional: z.enum(['$or', '$and']).default('$or')
});

export const getCardSchema = z.strictObject({
  cardId: z.string().regex(hex24)
});

export const updateCardSchema = z.strictObject({
  context: z.string().trim().max(200).optional(),
  front: z.string().trim().max(1500),
  back: z.string().trim().max(1500),
  explanation: z.string().trim().max(3000).optional(),
  mirror: z.boolean().default(false),
  tags: z.array(z.string().trim().min(1).max(50)).max(20).default([]),
  pairId: z.uuid().optional(),
  deckId: z.string().regex(hex24),
  _id: z.string().regex(hex24).optional()
});

export const updateCardSchemaParams = z.strictObject({
  cardId: z.string().regex(hex24)
});



export const bulkPatchCardsSchema = z.strictObject({
  option: z.enum(['setDue', 'reset', 'addTag', 'removeTag', 'delete']),
  cardIds: z.array(z.string().regex(hex24)),
  pairIds: z.array(z.uuid()),
  due: z.number().max(1000).optional(),
  tag: z.string().trim().min(1).max(50).optional()
});