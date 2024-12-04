import { Router } from 'express';
import { purchaseController } from '../controllers/purchase.controller.js';
import { verifyUserToken } from '../middleware.js';

const router = Router();

// realizar una compra
router.post('/purchase', verifyUserToken, purchaseController.makePurchase);

export default router;
