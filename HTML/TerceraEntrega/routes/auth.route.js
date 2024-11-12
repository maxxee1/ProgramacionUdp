import { Router } from 'express';
import { authController } from '../controllers/auth.controller.js';

const router = Router();

// Registrar un nuevo usuario
router.post('/signup', authController.register);

// Iniciar sesión
router.post('/login', authController.login);

export default router;
