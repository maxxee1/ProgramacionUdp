import { Router } from 'express';
import { authController } from '../controllers/auth.controller.js';

const router = Router();

// registrar un nuevo usuario
router.post('/signup', authController.register);

// iniciar sesion
router.post('/login', authController.login);

export default router;
