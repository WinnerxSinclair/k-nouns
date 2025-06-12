import express from 'express'
import userController from '../controllers/userController.js'
const router = express.Router();

router.patch('/tags', userController.addTag);
router.get('/tags', userController.getTags);

export default router;