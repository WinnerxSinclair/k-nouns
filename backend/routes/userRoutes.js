import express from 'express'
import userController from '../controllers/userController.js'
import { tagNameSchemaParams } from '../validators/tag.js';
import { validateBody } from '../middleware/validate.js'
const router = express.Router();

router.patch('/tags', validateBody(tagNameSchemaParams), userController.addTag);
router.get('/tags', userController.getTags);
router.get('/tokens', userController.checkTokens);

export default router;