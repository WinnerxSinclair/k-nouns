import express from 'express'
import claudeController from '../controllers/claudeController.js';
import { validateBody } from '../middleware/validate.js';
import { translateSchema, explainSchema } from '../../shared/zodSchemas/claude.js';
const router = express.Router();

router.post('/translate', validateBody(translateSchema), claudeController.translate);
router.post('/explain', validateBody(explainSchema), claudeController.explain);
export default router