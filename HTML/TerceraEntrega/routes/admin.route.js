import { Router } from 'express';
import { adminController } from '../controllers/admin.controller.js';
import { verifyAdminToken } from '../middleware.js';

const router = Router();

// Obtener el total de ganancias y productos
router.get('/admin/total', verifyAdminToken, adminController.getTotal);

// Agregar un nuevo producto
router.post('/admin/products', verifyAdminToken, adminController.addNewProduct);

// Eliminar un producto
router.delete('/admin/products/:id', verifyAdminToken, adminController.deleteProduct);

// Obtener un producto específico para editar
router.post('/admin/product/:id', verifyAdminToken, adminController.updateProduct);


export default router;
