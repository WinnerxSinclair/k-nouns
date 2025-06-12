import express from 'express'
import claudeController from '../controllers/claudeController.js';

const router = express.Router();

router.post('/translate', claudeController.translate);
router.post('/explain', claudeController.explain);
export default router