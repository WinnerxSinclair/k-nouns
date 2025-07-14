import express from 'express'
import tagController from '../controllers/tagController.js'
import { tagNameSchemaParams, tagNameSchemaBody } from '../validators/tag.js';
import { validateParams, validateBody } from '../middleware/validate.js'
const router = express.Router();

router.patch('/:tagName', validateParams(tagNameSchemaParams), validateBody(tagNameSchemaBody), tagController.updateTagName);
router.delete('/:tagName', validateParams(tagNameSchemaParams), tagController.removeTag);

export default router