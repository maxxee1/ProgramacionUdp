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

const authMiddleware = (req, res, next) => {
  const token = req.cookies[AUTH_COOKIE_NAME];
  try {
    req.user = jwt.verify(token, clave);
    next();
  } catch (e) {
    res.render('unauthorized');
  }
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
  res.render('login');
});

app.get('/profile', authMiddleware,  async (req, res) => {
  const useerId = req.user.id
  const query = 'SELECT name, email users WHERE id= $1';
  const results = await sql(query, [useerId]);
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

app.get('/addproduct', (req, res) => {
  res.render('addProduct');
});

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
  const name = req.body.name;
  const email = req.body.email;
  const password = req.body.password;

  /*-------- bcrypt algorithm --------*/
  const hash = bcrypt.hashSync(password, 5);

  /*-------- auto login --------*/
  const query = 'INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING id';
  const results = await sql (query, [name, email, hash]);

  /*-------- return id --------*/
  const id = results[0].id;

  /*-------- JWT Token --------*/
  const TimeLogged30 = Math.floor(Date.now() / 1000) + 30 * 60;
  const token = jwt.sign({ id , exp: TimeLogged30} , clave);

  res.cookie(AUTH_COOKIE_NAME, token, { maxAge: 60 * 30 * 1000});
  res.redirect(302, '/profile')
  
});

/*---------- Use Port ----------*/
app.listen(3000, () => console.log('te lo meti'));