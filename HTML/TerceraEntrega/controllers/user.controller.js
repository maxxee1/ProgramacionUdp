import sql from '../db.js';

export const userController = {
  // saca la info del usuario (id, nombre, email)
  getUserInfo: async (req, res) => {
    const userId = req.user.id;
    try {
      const user = await sql('SELECT id, name, email FROM users WHERE id = $1', [userId]);
      if (user.length === 0) {
        return res.status(404).json({ message: 'Usuario no encontrado' });
      }
      res.status(200).json(user[0]);
    } catch (error) {
      console.error('Error al obtener información del usuario:', error);
      res.status(500).json({ message: 'Error del servidor' });
    }
  },

  // actualiza los datos del usuario
  updateUserInfo: async (req, res) => {
    const userId = req.user.id;
    const { name, email } = req.body;
    try {
      const updatedUser = await sql('UPDATE users SET name = $1, email = $2 WHERE id = $3 RETURNING *', [name, email, userId]);
      res.status(200).json({ message: 'Información del usuario actualizada', user: updatedUser[0] });
    } catch (error) {
      console.error('Error al actualizar información del usuario:', error);
      res.status(500).json({ message: 'Error del servidor' });
    }
  }
};
