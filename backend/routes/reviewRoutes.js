import express from 'express'
import cardController from '../controllers/cardController.js'
import { reviewCardsSchema, gradeCardsSchema } from '../../shared/zodSchemas/card.js'
import { validateBody } from '../middleware/validate.js';
const router = express.Router();

router.put('/card', validateBody(gradeCardsSchema), cardController.gradeCard); 
router.post('/batch', validateBody(reviewCardsSchema), cardController.getCardBatch);
router.get('/cards/due', cardController.dueCardCounts);
export default router


