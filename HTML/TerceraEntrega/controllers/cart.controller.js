import sql from '../db.js';

export const cartController = {
  // obtiene el carrito del user
  getCart: async (req, res) => {
    const userId = req.user.id;
    try {
      // en caso de no existir arroja el msj
      const cartExists = await sql('SELECT * FROM carts WHERE user_id = $1', [userId]);
      if (cartExists.length === 0) {
        return res.status(404).json({ message: 'Carrito vacío' });
      }

      // en caso de estar vacio arroja el msj
      const cartItems = await sql('SELECT * FROM cart_items WHERE cart_id = (SELECT id FROM carts WHERE user_id = $1)', [userId]);
      if (cartItems.length === 0) {
        return res.status(404).json({ message: 'Carrito vacío' });
      }

      // muestra el carro con sus productos
      const cart = await sql('SELECT p.id, p.name, p.price, ci.quantity FROM products p JOIN cart_items ci ON p.id = ci.product_id WHERE ci.cart_id = (SELECT id FROM carts WHERE user_id = $1)', [userId]);
      res.status(200).json(cart);
    } catch (error) {//por si explota
      console.error('Error al obtener carrito:', error);
      res.status(500).json({ message: 'Error del servidor' });
    }
  },

  // agrega un producto al carrito
  addItemToCart: async (req, res) => {
    const { id, quantity } = req.body;
    const userId = req.user.id;
    try {
      // ve si el usuario tiene un cart en carts antes de insertar
      const cartExists = await sql('SELECT * FROM carts WHERE user_id = $1', [userId]);
      if (cartExists.length === 0) {
        await sql('INSERT INTO carts (user_id) VALUES ($1)', [userId]);
      }

      const cart = await sql('INSERT INTO cart_items (cart_id, product_id, quantity) VALUES ((SELECT id FROM carts WHERE user_id = $1), $2, $3) RETURNING *', [userId, id, quantity]);
      res.status(201).json(cart);
    } catch (error) {
      console.error('Error al agregar al carrito:', error);
      res.status(500).json({ message: 'Error del servidor' });
    }
  },

  // elimina un producto del carrito
  removeItemFromCart: async (req, res) => {
    const { productId } = req.params;
    const userId = req.user.id;
    try {
      const cart = await sql('DELETE FROM cart_items WHERE product_id = $1 AND cart_id = (SELECT id FROM carts WHERE user_id = $2) RETURNING *', [productId, userId]);
      if (cart.length === 0) {
        return res.status(404).json({ message: 'Producto no encontrado en el carrito' });
      }
      res.status(200).json({ message: 'Producto eliminado del carrito' });
    } catch (error) {
      console.error('Error al eliminar del carrito:', error);
      res.status(500).json({ message: 'Error del servidor' });
    }
  }
};
