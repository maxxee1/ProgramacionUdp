import { Router } from 'express';
import { adminController } from '../controllers/admin.controller.js';
import { verifyAdminToken } from '../middleware.js';

const router = Router();

// obtener el total de ganancias y productos
router.get('/admin/total', verifyAdminToken, adminController.getTotal);

// agregar un nuevo producto
router.post('/admin/products', verifyAdminToken, adminController.addNewProduct);

// eliminar un producto
router.delete('/admin/products/:id', verifyAdminToken, adminController.deleteProduct);

// obtener un producto específico para editar
router.post('/admin/product/:id', verifyAdminToken, adminController.updateProduct);


export default router;
