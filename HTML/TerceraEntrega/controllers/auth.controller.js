import sql from '../db.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs'; // corregir typo en 'bycrypt'

const clave = 'INSAAAID'; // clave para firmar el JWT

export const authController = {
  // registro de usuario
  register: async (req, res) => {
    const { name, email, password } = req.body;
    try {
      // verifica si el email ya esta registrado
      const existingUser = await sql('SELECT * FROM users WHERE email = $1', [email]);
      if (existingUser.length > 0) {
        return res.status(400).json({ message: 'El correo electrónico ya está registrado.' });
      }

      // hashea la contraseña d pana
      const hashedPassword = await bcrypt.hash(password, 10);

      // crea el nuevo usuario con la contra ya hasheada
      const newUser = await sql(
        'INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING *',
        [name, email, hashedPassword]
      );

      // obtiene el usuario recien creado
      const createdUser = newUser[0];

      const payload = {
        id: createdUser.id, 
        role: createdUser.admin, 
      };

      // genera el token JWT
      const token = jwt.sign(payload, clave);

      // establece cookie con el token
      res.cookie('token', token, {
        httpOnly: true,
        secure: false,
        sameSite: 'lax',
      });
      //le avisamos que se registro correctamente
      return res.status(200).json({
        ok: true,
        message: 'Usuario registrado con éxito',
        token,
      });
    } catch (error) {
      console.error('Error al registrar usuario:', error);
      res.status(500).json({ message: 'Error del servidor' });
    }
  },

  // login de usuario
  login: async (req, res) => {
    const { email, password } = req.body;
    try {
      //busca el usuario con el correo
      const user = await sql('SELECT * FROM users WHERE email = $1', [email]);

      // si no lo encuentra, chao nomas
      if (!user.length) {
        return res.status(401).json({ message: 'Credenciales inválidas' });
      }
      // agarra este user
      const loggedUser = user[0];

      // revisa si la clave que puso es igual
      const validPassword = await bcrypt.compare(password, loggedUser.password);
      if (!validPassword) {
        return res.status(401).json({ message: 'Credenciales inválidas' });
      }

      const payload = {
        id: loggedUser.id,
        role: loggedUser.admin,
      };

      // genera el token JWT
      const token = jwt.sign(payload, clave);

      // guarda el token en una cookie
      res.cookie('token', token, {
        httpOnly: true,
        secure: false,
        sameSite: 'lax',
      });
      // le avisamos que se logeo bien
      return res.status(200).json({
        message: 'Login exitoso',
        token,
      });
    } catch (error) {
      console.error('Error al iniciar sesión:', error);
      res.status(500).json({ message: 'Error del servidor' });
    }
  },
};
