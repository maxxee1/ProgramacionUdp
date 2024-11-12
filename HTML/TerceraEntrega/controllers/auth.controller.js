import sql from '../db.js';
import jwt from 'jsonwebtoken';
import bycrypt from 'bcryptjs';

const clave = 'INSAAAID'; // Clave para firmar el JWT

export const authController = {
  // Registro de usuario
  register: async (req, res) => {
    const { name, email, password } = req.body;
    try {
      // Verificar si el email ya está registrado
      const existingUser = await sql('SELECT * FROM users WHERE email = $1', [
        email,
      ]);
      if (existingUser.length > 0) {
        return res
          .status(400)
          .json({ message: 'El correo electrónico ya está registrado.' });
      }

      // Crear nuevo usuario
      const newUser = await sql(
        'INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING *',
        [name, email, password],
      );
      res
        .status(201)
        .json({ message: 'Usuario registrado exitosamente', user: newUser[0] });
    } catch (error) {
      console.error('Error al registrar usuario:', error);
      res.status(500).json({ message: 'Error del servidor' });
    }
  },

  // Login de usuario
  login: async (req, res) => {
    try {
      const { email, password } = req.body;

      // Busca el usuario en la base de datos
      const user = await sql(
        'SELECT * FROM users WHERE email = $1',
        [email],
      );

      // Verifica si el usuario existe
      if (!user.length) {
        return res.status(401).json({ message: 'Credenciales inválidas' });
      }

      // Toma el primer usuario (deberías asegurarte de que solo hay uno)
      const loggedUser = user[0];

      const hashedPassword = loggedUser.password;
      const validPassword = await bycrypt.compare(password, hashedPassword);

      // Verifica si la contraseña es válida
      if (!validPassword) {
        return res.status(401).json({ message: 'Credenciales inválidas' });
      }

      const payload = {
        id: loggedUser.id,
        role: loggedUser.admin,
      };

      // Genera el token incluyendo el ID y el atributo isAdmin
      const token = jwt.sign(payload, clave);

      // Crear cookie
      res.cookie('token', token, {
        httpOnly: true,
        secure: false,
        sameSite: 'lax',
      });

      return res.status(200).json({
        message: 'Login exitoso',
        token
      });
    } catch (error) {
      console.error('Error al iniciar sesión:', error);
      res.status(500).json({ message: 'Error del servidor' });
    }
  },
};
