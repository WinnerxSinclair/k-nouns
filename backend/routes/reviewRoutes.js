import express from 'express'
import flashcardController from '../controllers/flashcardController.js'

const router = express.Router();

router.put('/card', flashcardController.gradeCard);
router.post('/batch', flashcardController.getCardBatch);
router.get('/cards/due', flashcardController.dueCardCounts);
export default router


