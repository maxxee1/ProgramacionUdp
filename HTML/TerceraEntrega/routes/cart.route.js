import { Router } from 'express';
import { cartController } from '../controllers/cart.controller.js';
import { verifyUserToken } from '../middleware.js';

const router = Router();

// obtener carrito del usuario
router.get('/shoppingcart', verifyUserToken, cartController.getCart);

// agregar un producto al carrito
router.post('/shoppingcart/:id', verifyUserToken, cartController.addItemToCart);

// eliminar un producto del carrito
router.delete('/shoppingcart/:productId', verifyUserToken, cartController.removeItemFromCart);

export default router;
