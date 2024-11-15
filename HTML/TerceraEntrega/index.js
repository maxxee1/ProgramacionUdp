import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import swaggerUI from 'swagger-ui-express';
import YAML from 'yamljs';

const PORT = 3001;

// - Rutas - 
import authRouter from './routes/auth.route.js';
import productsRouter from './routes/products.route.js';
import cartRouter from './routes/cart.route.js';
import purchaseRouter from './routes/purchase.route.js';
import userRouter from './routes/user.route.js';
import adminRouter from './routes/admin.route.js';

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Configuración de Swagger
const swaggerDocs = YAML.load('./api.yaml');
app.use('/api/home', swaggerUI.serve, swaggerUI.setup(swaggerDocs));

// Rutas
// -- Autenticación
app.use('/api', authRouter);

// -- Productos
app.use('/api', productsRouter);

// -- Carrito de compras
app.use('/api', cartRouter);

// -- Compras
app.use('/api', purchaseRouter);

// -- Usuario
app.use('/api', userRouter);

//-- Admin
app.use('/api', adminRouter);

// Servidor
app.listen(PORT, () => console.log('Servidor usando en http://localhost:' + PORT + '/api/home'));
