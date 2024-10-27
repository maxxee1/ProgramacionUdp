import { neon } from '@neondatabase/serverless';
import jwt from 'jsonwebtoken';
import cookieParser from 'cookie-parser';
import express from 'express';
import { engine } from 'express-handlebars';
import bcrypt from 'bcryptjs';


/*--- ULTRA HYPER MEGA SECRET PASSWORD, PLEASE DONT HACK ME :) ---*/
const clave = 'INSAAAID'

/*---------- CookieName----------*/
const AUTH_COOKIE_NAME = 'nami'

/*---------- DataBase Conection ----------*/
const sql = neon('postgresql://neondb_owner:scR5o3JDNuzv@ep-cool-paper-a5dz9krs.us-east-2.aws.neon.tech/neondb?sslmode=require');


/*---------- Instantiate Express ----------*/
const app = express();

/*---------- Communications Middleware ----------*/
app.use(express.json()); // Forms
app.use(express.urlencoded({ extended: false })); // URL parameters
app.use(cookieParser()); // Read cookies

const authMiddleware = async (req, res, next) => {
  const token = req.cookies[AUTH_COOKIE_NAME];

  try {
    req.user = jwt.verify(token, clave);
    const results = await sql('SELECT * FROM users WHERE id = $1', [
      req.user.id,
    ]);
    req.user = results[0];
    req.user.salutation = `Hola ${req.user.name}`;
    next();
  } catch (e) {
    res.render('unauthorized');
  }
};

const isAdminMiddleware = async (req, res, next) => {
  if (!req.user.admin) {
    res.send('No eres admin');
    return;
  }
  next();
};

/*---------- Engine Templates ----------*/
app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', './views');
app.use('/resources', express.static('resources'));


/*---------- Set Endpoints ----------*/
app.get('/', (req, res) => {
  res.render('home');
});

app.get('/login', (req, res) => {
  const error = req.query.error;
  res.render('login', { error });
});

app.get('/profile', authMiddleware,  async (req, res) => {
  const userId = req.user.id
  const query = 'SELECT name, email, money FROM users WHERE id= $1';
  const results = await sql(query, [userId]);
  const user = results[0];

  res.render('profile', user);
});

app.get('/signup', (req, res) => {
  res.render('signup');
});

app.get('/unauthorized', (req, res) => {
  res.render('unauthorized');
});

app.get('/product', async (req, res) => {
  const products = await sql('SELECT * FROM products')
  res.render('catalogo', { products });
});

app.get('/cart', async (req, res) => {
  res.render('carrito');
});

app.get('/addproduct', authMiddleware, isAdminMiddleware, async (req, res) => {
  res.render('addProduct');
});

app.get('/adminview', (req, res) => {
  res.render('admin');
});

app.get('/logout', (req, res) => {
  res.cookie(AUTH_COOKIE_NAME, '', { maxAge: 1 });
  res.send('sesion sesiada');
});

app.get('/admin', authMiddleware, isAdminMiddleware, async (req, res) => {
  const money = await sql('SELECT SUM(amount) FROM sales');
  const total = money[0].sum;
  const products = await sql('SELECT * FROM products');

  res.render('admin', { total, products });
});

app.get('/products/editar/:id',authMiddleware,isAdminMiddleware,
  async (req, res) => {
    const id = req.params.id;
    const product = await sql('SELECT * FROM products WHERE id = $1', [id]);
    res.render('editar', product[0]);
  }
);

/*---------- Set POST METHOD ----------*/
app.post('/products', async (req, res) => {
  const id = req.body.id;
  const stock = req.body.stock;
  const name = req.body.name;
  const price = req.body.price;
  const image_path = req.body.image_path;
  const description = req.body.description;

  const query = 'INSERT INTO products (id, stock, name, price, image_path, description) VALUES ($1, $2, $3, $4, $5, $6)';
  await sql(query, [id, stock, name, price, image_path, description]);
  res.redirect('/product');
});

app.post('/signup', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Validación de entradas
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Todos los campos son obligatorios.' });
    }

    /*-------- bcrypt algorithm --------*/
    const hash = bcrypt.hashSync(password, 5);

    /*-------- auto login --------*/
    const query = 'INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING id';
    const results = await sql(query, [name, email, hash]);

    /*-------- return id --------*/
    const id = results[0].id;

    /*-------- JWT Token --------*/
    const TimeLogged30 = Math.floor(Date.now() / 1000) + 30 * 60;
    const token = jwt.sign({ id, exp: TimeLogged30 }, clave);

    res.cookie(AUTH_COOKIE_NAME, token, { maxAge: 60 * 30 * 1000 });
    res.redirect('/profile');
  } catch (error) {
    console.error('Error during signup:', error);
    
    // Redirigir a una página de error genérica
    res.redirect('/unauthorized');
  }
});

app.post('/login', async (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  const query ='SELECT id, password FROM users WHERE email = $1'
  const results = await sql(query, [email]);

  if(results.length === 0) {
    res.redirect(302, '/login?error=unauthorized')
    return;
  }

  const id = results[0].id;
  const hash = results[0].password;

  if(bcrypt.compareSync(password, hash)) {
    const TimeLogged30 = Math.floor(Date.now() / 1000) + 30 * 60;
    const token = jwt.sign({ id , exp: TimeLogged30} , clave);
  
    res.cookie(AUTH_COOKIE_NAME, token, { maxAge: 60 * 30 * 1000});
    res.redirect(302, '/profile')
    return;
  }

  res.redirect('/login?error=unauthorized');
}); 

app.post(
  '/products/delete/:id',
  authMiddleware,
  isAdminMiddleware,
  async (req, res) => {
    const id = req.params.id;
    await sql('DELETE FROM products WHERE id = $1', [id]);
    res.redirect('/admin');
  }
);
app.post(
  '/products/editar/:id',
  authMiddleware,
  isAdminMiddleware,
  async (req, res) => {
    const id = req.params.id;

    const name = req.body.name;
    const price = req.body.price;
    const image_path = req.body.image_path;

    await sql(
      'UPDATE products SET name = $1, price = $2, image_path = $3 WHERE id = $4',
      [name, price, image_path, id]
    );

    res.redirect('/admin');
  }
);

/* ---------- Ver el Carrito ---------- */
app.get('/cart', authMiddleware, async (req, res) => {
  const userId = req.user.id;
  
  // Consulta productos del carrito del usuario actual
  const query = `
    SELECT p.id, p.name, p.price, c.quantity
    FROM cart AS c
    JOIN products AS p ON c.product_id = p.id
    WHERE c.user_id = $1;
  `;
  const cartItems = await sql(query, [userId]);
  
  // Calcula el total
  const totalAmount = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  res.render('carrito', { cartItems, totalAmount });
});

/* ---------- Agregar Producto al Carrito ---------- */
app.post('/cart/add', authMiddleware, async (req, res) => {
  const userId = req.user.id;
  const productId = req.body.product_id;
  const quantity = req.body.quantity || 1;

  const query = `
    INSERT INTO cart_items (user_id, product_id, quantity)
    VALUES ($1, $2, $3)
    ON CONFLICT (user_id, product_id)
    DO UPDATE SET quantity = cart.quantity + $3;
  `;
  
  await sql(query, [userId, productId, quantity]);
  res.redirect('/cart');
});

/* ---------- Actualizar Cantidad en el Carrito ---------- */
app.post('/cart/update/:productId', authMiddleware, async (req, res) => {
  const userId = req.user.id;
  const productId = req.params.productId;
  const quantity = req.body.quantity;

  const query = `
    UPDATE cart SET quantity = $1
    WHERE user_id = $2 AND product_id = $3;
  `;
  
  await sql(query, [quantity, userId, productId]);
  res.redirect('/cart');
});

/* ---------- Eliminar Producto del Carrito ---------- */
app.post('/cart/delete/:productId', authMiddleware, async (req, res) => {
  const userId = req.user.id;
  const productId = req.params.productId;

  const query = `
    DELETE FROM cart WHERE user_id = $1 AND product_id = $2;
  `;
  
  await sql(query, [userId, productId]);
  res.redirect('/cart');
});


/*---------- Use Port ----------*/
app.listen(3000, () => console.log('te lo meti'));
