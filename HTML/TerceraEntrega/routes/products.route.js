import { Router } from 'express';
import { productsController } from '../controllers/products.controller.js';

const router = Router();

// Obtener todos los productos
router.get('/products', productsController.getAllProducts);

// obtener un nuevo producto
router.get('/product/:id', productsController.getProduct);

export default router;
