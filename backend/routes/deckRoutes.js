import express from 'express'
import cardController from '../controllers/cardController.js'
import multer from 'multer'
import { validateBody, validateParams } from '../middleware/validate.js';
import { createDeckSchema, deckIdSchema, exportDeckSchema } from '../validators/deck.js';
import { createCardSchema } from '../validators/card.js';
const upload = multer();
const router = express.Router();
router.post('/', validateBody(createDeckSchema), cardController.createDeck);
router.post('/:deckId/cards', validateParams(deckIdSchema), validateBody(createCardSchema), cardController.createCard);
router.get('/:deckId/cards', validateParams(deckIdSchema), cardController.getCards);
router.get('/:deckId/tags', validateParams(deckIdSchema), cardController.getDeckTags);
router.get('/:deckId', validateParams(deckIdSchema), cardController.getDeckById);
router.get('/', cardController.getDecks);
router.delete('/:deckId', validateParams(deckIdSchema), cardController.deleteDeck);
router.patch('/:deckId/nameChange', validateParams(deckIdSchema), validateBody(createDeckSchema), cardController.updateDeckName);
router.post('/export', validateBody(exportDeckSchema), cardController.exportDeck);
router.post('/import', upload.single('file'), cardController.importDeck)



export default router;