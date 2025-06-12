import express from 'express'
import tokenUsageController from '../controllers/tokenUsageController.js'
const router = express.Router();

router.patch('', tokenUsageController.updateTokenUsage);
router.get('', tokenUsageController.getTokenUsage)

export default router