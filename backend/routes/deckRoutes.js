import express from 'express'
import cardController from '../controllers/cardController.js'
import multer from 'multer'
import { validateBody, validateParams } from '../middleware/validate.js';
import { exportDeckSchema } from '../validators/deck.js';
import { createDeckSchema } from '../../shared/zodSchemas/deck.js';
import { validateMongoId } from '../../shared/zodSchemas/general.js'
import { createCardSchema } from '../../shared/zodSchemas/card.js';
const upload = multer();
const router = express.Router();
const d = 'deckId';
router.post('/', validateBody(createDeckSchema), cardController.createDeck);
router.post('/:deckId/cards', validateParams(validateMongoId(d)), validateBody(createCardSchema), cardController.createCard);
router.get('/:deckId/cards', validateParams(validateMongoId(d)), cardController.getCards);
router.get('/:deckId/tags', validateParams(validateMongoId(d)), cardController.getDeckTags);
router.get('/:deckId', validateParams(validateMongoId(d)), cardController.getDeckById);
router.get('/', cardController.getDecks);
router.delete('/:deckId', validateParams(validateMongoId(d)), cardController.deleteDeck);
router.patch('/:deckId/nameChange', validateParams(validateMongoId(d)), validateBody(createDeckSchema), cardController.updateDeckName);
router.post('/export', validateBody(exportDeckSchema), cardController.exportDeck);
router.post('/import', upload.single('file'), cardController.importDeck)



export default router;