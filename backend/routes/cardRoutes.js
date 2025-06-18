import express from 'express'
import flashcardController from '../controllers/flashcardController.js';
const router = express.Router();

router.delete('/:cardId', flashcardController.deleteCard);
router.get('/:cardId', flashcardController.getCard);
router.post('/:cardId', flashcardController.updateCard);

export default router