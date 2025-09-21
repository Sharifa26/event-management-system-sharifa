import express from 'express';
import authController from '../controllers/authController.js';
import { validateUser } from '../middleware/validateUserMiddleware.js';
const router = express.Router();

router.post('/register', validateUser, authController.register);
router.post('/login', authController.login);

export default router;
