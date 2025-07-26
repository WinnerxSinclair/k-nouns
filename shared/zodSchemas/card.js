// import * as z from "zod/v4";
import { z } from 'zod'
import { tagSchema } from './tag.js';
import { 
  CONTEXT_MAX_LEN, 
  FRONT_MAX_LEN, 
  BACK_MAX_LEN, 
  EXPLANATION_MAX_LEN,
  TAG_MAX_LEN,
  TAG_MIN_LEN,
  TAG_ARR_MAX_LEN,
  
  MAX_DECKS,
  MAX_TAGS,

  MAX_DUE_DATE,
  MIN_DUE_DATE,

  MAX_CARDS,

  MAX_EASE,
  MAX_SRS,

  hex24,
  MIN_EASE
} from '../constants/zod/validation.js';


const baseCardSchema = z.strictObject({
  context:     z.string().trim().max(CONTEXT_MAX_LEN).optional(),
  front:       z.string().trim().max(FRONT_MAX_LEN),
  back:        z.string().trim().max(BACK_MAX_LEN),
  explanation: z.string().trim().max(EXPLANATION_MAX_LEN).optional(),
  mirror:      z.boolean().default(false),
  tags:        z.array(z.string().trim().min(TAG_MIN_LEN).max(TAG_MAX_LEN)).max(TAG_ARR_MAX_LEN).default([])
});
export const createCardSchema = z.strictObject({
  ...baseCardSchema.shape
});

export const updateCardSchema = z.strictObject({
  ...baseCardSchema.shape,
  pairId:      z.uuid().optional(),
  deckId:      z.string().regex(hex24),
  _id:         z.string().regex(hex24).optional()
});

export const dashboardCardsSchema = z.strictObject({
  decks:       z.array(z.string().regex(hex24)).max(MAX_DECKS).default([]),
  tags:        z.array(z.string().trim()).max(MAX_TAGS).default([]),
  conditional: z.enum(['$in', '$all']).default('$in')
});

export const reviewCardsSchema = z.strictObject({
  decks:       z.array(z.string().regex(hex24)).max(MAX_DECKS).default([]),
  tags:        z.array(z.string().trim()).max(MAX_TAGS).default([]),
  conditional: z.enum(['$or', '$and']).default('$or')
});

export const gradeCardsSchema = z.strictObject({
  _id:      z.string().regex(hex24),
  ease:     z.number().min(MIN_EASE).max(MAX_EASE),
  lapses:   z.number().min(0).max(MAX_SRS),
  reps:     z.number().min(0).max(MAX_SRS),
  interval: z.number().min(0).max(MAX_SRS),
  grade:    z.number().min(1).max(5)
});



export const bulkPatchCardsDefaultSchema = z.strictObject({
  cardIds: z.array(z.string().regex(hex24)).min(1).max(MAX_CARDS),
  pairIds: z.array(z.uuid()),
});

export const addRemoveTagSchema = z.strictObject({
  ...bulkPatchCardsDefaultSchema.shape,
  ...tagSchema.shape
});

export const updateDueDateSchema = z.strictObject({
  ...bulkPatchCardsDefaultSchema.shape,
  due: z.number().min(MIN_DUE_DATE).max(MAX_DUE_DATE)
});


export const bulkPatchCardsSchema = z.strictObject({
  option:  z.enum(['setDue', 'reset', 'addTag', 'removeTag', 'delete']),
  cardIds: z.array(z.string().regex(hex24)),
  pairIds: z.array(z.uuid()),
  due:     z.number().min(MIN_DUE_DATE).max(MAX_DUE_DATE).optional(),
  tag:     z.string().trim().min(TAG_MIN_LEN).max(TAG_MAX_LEN).optional()
});