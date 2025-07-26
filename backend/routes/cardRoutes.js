import express from 'express'
import cardController from '../controllers/cardController.js';

import { 
  addRemoveTagSchema, 
  updateDueDateSchema, 
  bulkPatchCardsDefaultSchema, 
  updateCardSchema,
  dashboardCardsSchema,
  

} from '../../shared/zodSchemas/card.js'

import { validateMongoId } from '../../shared/zodSchemas/general.js';
import { validateBody, validateParams } from '../middleware/validate.js';
const router = express.Router();

router.post('/bulk/tags', validateBody(addRemoveTagSchema), cardController.addTag);
router.patch('/bulk/tags', validateBody(addRemoveTagSchema), cardController.removeTag);

router.patch('/bulk/due', validateBody(updateDueDateSchema), cardController.updateDueDate);

router.patch('/bulk/srs', validateBody(bulkPatchCardsDefaultSchema), cardController.resetSrs);

router.post('/bulk', validateBody(bulkPatchCardsDefaultSchema), cardController.deleteCards);


router.get('/:cardId', validateParams(validateMongoId('cardId')), cardController.getCard);

router.post('/:cardId', validateParams(validateMongoId('cardId')), validateBody(updateCardSchema), cardController.updateCard);

router.post('/', validateBody(dashboardCardsSchema), cardController.getDashboardCards); 


export default router