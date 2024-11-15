import { neon } from '@neondatabase/serverless';
import jwt from 'jsonwebtoken';
import cookieParser from 'cookie-parser';
import express from 'express';
import { engine } from 'express-handlebars';
import bcrypt from 'bcryptjs';

/*--- ULTRA HYPER MEGA SECRET PASSWORD, PLEASE DONT HACK ME :) ---*/
const clave = 'INSAAAID';

/*---------- CookieName----------*/
const AUTH_COOKIE_NAME = 'nami';

/*---------- DataBase Conection ----------*/
const sql = neon(
  'postgresql://neondb_owner:scR5o3JDNuzv@ep-cool-paper-a5dz9krs.us-east-2.aws.neon.tech/neondb?sslmode=require'
);

/*---------- Instantiate Express ----------*/
const app = express();

/*---------- Communications Middleware ----------*/
app.use(express.json()); // Forms
app.use(express.urlencoded({ extended: false })); // URL parameters
app.use(cookieParser()); // Read cookies
app.use((req, res, next) => {
  res.locals.user = req.user; // Pasamos user a todas las vistas
  next();
});


const authMiddleware = async (req, res, next) => {
  const token = req.cookies[AUTH_COOKIE_NAME];

  if (!token) {
    req.user = null; // No hay token, usuario no autenticado
    return next();
  }

  try {
    const decoded = jwt.verify(token, clave); // Verificar el token
    const results = await sql(
      'SELECT id, name, money, admin FROM users WHERE id = $1',
      [decoded.id],
    );

    if (results.length > 0) {
      req.user = results[0]; // Usuario encontrado, asignar a `req.user`
    } else {
      req.user = null; // Token válido, pero usuario no encontrado
    }
  } catch (e) {
    console.error('Error de autenticación:', e);
    req.user = null; // Error al verificar token, asignar null a `req.user`
  }

  next(); // Continuar con la ejecución sin detener el flujo
};



const isAdminMiddleware = (req, res, next) => {
  if (!req.user || req.user.admin !== true) {
    console.log(
      'Acceso denegado: el usuario no es admin o no está autenticado',
      req.user,
    );
    return res.status(403).render('unauthorized');
  }
  next();
};

/*---------- Engine Templates ----------*/
app.engine(
  'handlebars',
  engine(),
);
app.set('view engine', 'handlebars');
app.set('views', './views');
app.use('/resources', express.static('resources'));

/*---------- Set Endpoints ----------*/
app.get('/', authMiddleware, async (req, res) => {
  const user = req.user;
  res.render('home', { user });
});

app.get('/login', (req, res) => {
  const error = req.query.error;
  res.render('login', { error });
});

app.get('/profile', authMiddleware, async (req, res) => {
  const userId = req.user.id;
  const query = 'SELECT name, email, money FROM users WHERE id= $1';
  const results = await sql(query, [userId]);
  const user = results[0];

  res.render('profile', { user, email: user.email, money: user.money });
});

app.get('/signup', (req, res) => {
  res.render('signup');
});

app.get('/unauthorized', (req, res) => {
  res.render('unauthorized');
});

app.get('/product', authMiddleware, async (req, res) => {
  const user = req.user;
  const products = await sql('SELECT * FROM products');
  res.render('catalogo', { products, user });
});

app.get('/addproduct', authMiddleware, isAdminMiddleware, async (req, res) => {
  res.render('addProduct');
});

app.get('/adminview', authMiddleware, async (req, res) => {
  const user = req.user;

  if (user.admin == false) {
    // renderizar una vista de error
    return res.status(403).render('unauthorized');
  }

  const money = await sql('SELECT SUM(amount) FROM sales');
  const total = money[0].sum;

  const products = await sql('SELECT * FROM products');
  const isTotalLow = total < 20000;

  res.render('admin', {
    user,
    total,
    products,
    isTotalLow,
  });
});

app.get('/products/editar/:id',
  authMiddleware,
  isAdminMiddleware,
  async (req, res) => {
    const id = req.params.id;
    const product = await sql('SELECT * FROM products WHERE id = $1', [id]);
    res.render('editar', product[0]);
  }
);
app.get('/wallet', authMiddleware, async (req, res) => {
  try {
    const user = req.user;
    const userId = req.user.id; // Obtenemos el ID del usuario autenticado
    const query = 'SELECT money FROM users WHERE id = $1';
    const result = await sql(query, [userId]);
    const walletBalance = result[0].money;

    res.render('wallet', { walletBalance, user });
  } catch (error) {
    console.error('Error al obtener el saldo de la wallet:', error);
    res.status(500).send('Error en el servidor');
  }
});

/*---------- Set POST METHOD ----------*/
app.post('/products', async (req, res) => {
  const id = req.body.id;
  const stock = req.body.stock;
  const name = req.body.name;
  const price = req.body.price;
  const image_path = req.body.image_path;
  const description = req.body.description;

  const query =
    'INSERT INTO products (id, stock, name, price, image_path, description) VALUES ($1, $2, $3, $4, $5, $6)';
  await sql(query, [id, stock, name, price, image_path, description]);
  res.redirect('/product');
});

app.post('/signup', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Validación de entradas
    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ message: 'Todos los campos son obligatorios.' });
    }

    /*-------- bcrypt algorithm --------*/
    const hash = bcrypt.hashSync(password, 5);

    /*-------- auto login --------*/
    const query =
      'INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING id';
    const results = await sql(query, [name, email, hash]);

    /*-------- return id --------*/
    const id = results[0].id;

    /*-------- JWT Token --------*/
    const TimeLogged30 = Math.floor(Date.now() / 1000) + 30 * 60;
    const token = jwt.sign({ id, exp: TimeLogged30 }, clave);

    /*res.cookie(AUTH_COOKIE_NAME, token, { maxAge: 60 * 30 * 1000 });*/
    res.cookie(AUTH_COOKIE_NAME, token, {
      httpOnly: true,      // Evita el acceso al cookie desde JavaScript
      secure: false,       // Como estás usando HTTP, debe ser false
      sameSite: "Lax",     // Ayuda a prevenir ataques CSRF
      expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7), // Expira en 7 días
    });
    
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

  const query = 'SELECT id, password FROM users WHERE email = $1';
  const results = await sql(query, [email]);

  if (results.length === 0) {
    res.redirect(302, '/login?error=unauthorized');
    return;
  }

  const id = results[0].id;
  const hash = results[0].password;

  if (bcrypt.compareSync(password, hash)) {
    const TimeLogged30 = Math.floor(Date.now() / 1000) + 30 * 60;
    const token = jwt.sign({ id, exp: TimeLogged30 }, clave);

    /*res.cookie(AUTH_COOKIE_NAME, token, { maxAge: 60 * 30 * 1000 });*/
    res.cookie(AUTH_COOKIE_NAME, token, {
      httpOnly: true,      // Evita el acceso al cookie desde JavaScript
      secure: false,       // Como estás usando HTTP, debe ser false
      sameSite: "Lax",     // Ayuda a prevenir ataques CSRF
      expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7), // Expira en 7 días
    });
    
    res.redirect(302, '/profile');
    return;
  }

  res.redirect('/login?error=unauthorized');
});

// Logout
app.post('/logout', (req, res) => {
  res.cookie(AUTH_COOKIE_NAME, '', { maxAge: 1 });
  res.redirect('/login');
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
  const userId = req.user.id; // Obtenemos el ID del usuario autenticado
  const user = req.user;

  console.log('User ID:', userId); // Debugging: Verificar el ID del usuario

  const query = `
    SELECT p.id, p.name, p.price, ci.quantity
    FROM cart_items AS ci
    JOIN carts AS c ON ci.cart_id = c.id
    JOIN products AS p ON ci.product_id = p.id
    WHERE c.user_id = $1;
  `;

  try {
    const cartItems = await sql(query, [userId]);

    if (cartItems.length === 0) {
      // Si no hay items en el carrito, renderizamos un mensaje adecuado
      return res.render('carrito', {
        user,
        cartItems: [],
        totalAmount: 0,
        message: 'Tu carrito está vacío.',
      });
    }

    console.log('Cart Items:', JSON.stringify(cartItems, null, 2)); // Verificar la estructura de los items

    // Calcular el total
    const totalAmount = cartItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
    console.log('Total Amount:', totalAmount);

    // Renderizar la vista del carrito, pasando los items y el total
    res.render('carrito', { cartItems, totalAmount, user });
  } catch (error) {
    console.error('Error al ejecutar la consulta:', error);
    res.status(500).send('Error en el servidor');
  }
});

/* ---------- Agregar Producto al Carrito ---------- */
app.post('/cart/add', authMiddleware, async (req, res) => {
  const userId = req.user.id;
  const productId = req.body.product_id;
  const quantity = req.body.quantity || 1;
  const user = req.user;

  // Obtiene el cart_id del usuario
  const cartQuery = `
    SELECT id FROM carts WHERE user_id = $1;
  `;
  const cartResult = await sql(cartQuery, [userId]);
  const cartId = cartResult[0]?.id;

  if (!cartId) {
    // Si no existe un carrito, crea uno
    const createCartQuery = `
      INSERT INTO carts (user_id) VALUES ($1) RETURNING id;
    `;
    const createCartResult = await sql(createCartQuery, [userId]);
    cartId = createCartResult[0].id;
  }

  const query = `
    INSERT INTO cart_items (cart_id, product_id, quantity)
    VALUES ($1, $2, $3)
    ON CONFLICT (cart_id, product_id)
    DO UPDATE SET quantity = cart_items.quantity + EXCLUDED.quantity;  -- Usa EXCLUDED para acceder a los nuevos valores
  `;

  await sql(query, [cartId, productId, quantity]);
  res.redirect('/cart');
});

/* ---------- Actualizar Cantidad en el Carrito ---------- */
app.post('/cart/update/:productId', authMiddleware, async (req, res) => {
  const userId = req.user.id;
  const productId = req.params.productId;
  const quantity = req.body.quantity;
  const user = req.user;

  // Consulta para obtener el carrito del usuario
  const cartQuery = `SELECT id FROM carts WHERE user_id = $1;`;
  const cart = await sql(cartQuery, [userId]);
  const cartId = cart[0].id;

  const query = `
    UPDATE cart_items SET quantity = $1
    WHERE cart_id = $2 AND product_id = $3;
  `;

  await sql(query, [quantity, cartId, productId]);
  res.redirect('/cart', {user});
});

/* ---------- Eliminar Producto del Carrito ---------- */
app.post('/cart/delete/:productId', authMiddleware, async (req, res) => {
  const userId = req.user.id;
  const productId = req.params.productId;
  const user = req.user;

  // Consulta para obtener el carrito del usuario
  const cartQuery = `SELECT id FROM carts WHERE user_id = $1;`;
  const cart = await sql(cartQuery, [userId]);
  const cartId = cart[0].id;

  const query = `
    DELETE FROM cart_items WHERE cart_id = $1 AND product_id = $2;
  `;

  await sql(query, [cartId, productId]);
  res.redirect('/cart');
});
/* ---------- Proceso de Pago ---------- */
app.post('/cart/checkout', authMiddleware, async (req, res) => {
  const userId = req.user.id; // ID del usuario autenticado

  try {
    // Obtener el carrito del usuario
    const cartQuery = `
      SELECT p.id, p.name, p.price, p.stock, ci.quantity
      FROM cart_items AS ci
      JOIN carts AS c ON ci.cart_id = c.id
      JOIN products AS p ON ci.product_id = p.id
      WHERE c.user_id = $1;
    `;
    const cartItems = await sql(cartQuery, [userId]);

    if (cartItems.length === 0) {
      return res.render('carrito', { message: 'Tu carrito está vacío.' });
    }

    // Calcular el total del carrito
    const totalAmount = cartItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    // Obtener el saldo del usuario
    const userQuery = 'SELECT money, name FROM users WHERE id = $1';
    const userResult = await sql(userQuery, [userId]);
    const userMoney = userResult[0].money;
    const userName = userResult[0].name;

    // Verificar si el usuario tiene suficiente dinero
    if (userMoney < totalAmount) {
      return res.render('carrito', {
        cartItems,
        totalAmount,
        message: 'Dinero insuficiente en la wallet.',
      });
    }

    // Actualizar el saldo del usuario
    const updateMoneyQuery =
      'UPDATE users SET money = money - $1 WHERE id = $2';
    await sql(updateMoneyQuery, [totalAmount, userId]);

    // Registrar la venta en la tabla `sales`
    const salesQuery = `
      INSERT INTO sales (user_id, amount) VALUES ($1, $2) RETURNING id;
    `;
    const salesResult = await sql(salesQuery, [userId, totalAmount]);
    const saleId = salesResult[0].id;

    // Actualizar el stock de los productos
    for (const item of cartItems) {
      const updateStockQuery = `
        UPDATE products SET stock = stock - $1 WHERE id = $2;
      `;
      await sql(updateStockQuery, [item.quantity, item.id]);
    }

    // Vaciar el carrito del usuario
    const emptyCartQuery = `
      DELETE FROM cart_items WHERE cart_id = (SELECT id FROM carts WHERE user_id = $1);
    `;
    await sql(emptyCartQuery, [userId]);

    // Renderizar el recibo con los datos del usuario
    res.render('receipt', {
      user: { id: userId, name: userName, money: userMoney - totalAmount },
      items: cartItems, // Productos en el carrito
      totalAmount, // Total de la compra
    });
  } catch (error) {
    console.error('Error en el proceso de pago:', error);
    res.status(500).send('Error en el servidor');
  }
});

/*---------- Use Port ----------*/
app.listen(3000, () => console.log('http://localhost:3000'));