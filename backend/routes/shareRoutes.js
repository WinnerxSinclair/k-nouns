import express from 'express'
import shareController from '../controllers/shareController.js';
const router = express.Router();

router.patch('/', shareController.checkShare);
router.post('/', shareController.importShare);

export default router