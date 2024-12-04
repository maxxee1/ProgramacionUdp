import { Router } from 'express';
import { userController } from '../controllers/user.controller.js';
import { verifyUserToken } from '../middleware.js';

const router = Router();

// obtener información del usuario
router.get('/profile', verifyUserToken, userController.getUserInfo);

export default router;
