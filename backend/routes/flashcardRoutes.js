import express from 'express'
import flashcardController from '../controllers/flashcardController.js'

const router = express.Router();
router.post('', flashcardController.createCardGroup);
router.post('/:collectionId/cards', flashcardController.createCard);
router.get('/:collectionId/cards', flashcardController.getCards);
router.get('/:collectionId/tags', flashcardController.getGroupTags);
router.get('/:collectionId', flashcardController.getGroupById);
router.get('', flashcardController.getGroups);
router.delete('/:cardId', flashcardController.deleteCard);
router.get('/cards/due', flashcardController.dueCardCounts);


export default router;