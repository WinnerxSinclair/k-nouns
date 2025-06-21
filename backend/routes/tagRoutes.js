import express from 'express'
import tagController from '../controllers/tagController.js'
const router = express.Router();

router.patch('/:tagName', tagController.updateTagName);
router.delete('/:tagName', tagController.removeTag);

export default router