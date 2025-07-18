import express from 'express'
import cardController from '../controllers/cardController.js';
import { 
  dashboardCardsSchema, 
  getCardSchema, 
  updateCardSchema, 
  updateCardSchemaParams,
  bulkPatchCardsSchema 
} 
from '../validators/card.js';
import { validateBody, validateParams } from '../middleware/validate.js';
const router = express.Router();

router.delete('/:cardId', cardController.deleteCard);

router.get('/:cardId', validateParams(getCardSchema), cardController.getCard);

router.post('/:cardId', validateParams(updateCardSchemaParams), validateBody(updateCardSchema), cardController.updateCard);

router.post('/', validateBody(dashboardCardsSchema), cardController.getDashboardCards);

router.patch('/bulk', validateBody(bulkPatchCardsSchema), cardController.bulkPatch);

router.post('/bulk/tags', cardController.addTag);
router.patch('/bulk/tags', cardController.removeTag);

router.patch('/bulk/due', cardController.updateDueDate);
export default router