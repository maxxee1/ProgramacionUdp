import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import swaggerUI from 'swagger-ui-express';
import YAML from 'yamljs';

const PORT = 3001;

// - rutas - 
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

// configuracion de Swagger
const swaggerDocs = YAML.load('./api.yaml');
app.use('/api/home', swaggerUI.serve, swaggerUI.setup(swaggerDocs));

// autenticacion
app.use('/api', authRouter);

// productos
app.use('/api', productsRouter);

// carrito de compras
app.use('/api', cartRouter);

// compras
app.use('/api', purchaseRouter);

// usuario
app.use('/api', userRouter);

// admin
app.use('/api', adminRouter);

// servidor
app.listen(PORT, () => console.log('Servidor usando el puerto: ' + PORT));
