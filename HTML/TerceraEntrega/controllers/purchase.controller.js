import sql from '../db.js';

export const purchaseController = {
  // Realizar una compra
  makePurchase: async (req, res) => {
    const userId = req.user.id;
    try {
      // Verificar si el carro esta vacio
      const cartExists = await sql('SELECT * FROM carts WHERE user_id = $1', [
        userId,
      ]);
      if (cartExists.length === 0) {
        return res.status(404).json({ message: 'Carrito vacío' });
      }
      // Verificar si tiene productos agregador al cart_items
      const cartItems = await sql(
        'SELECT * FROM cart_items WHERE cart_id = (SELECT id FROM carts WHERE user_id = $1)',
        [userId],
      );
      if (cartItems.length === 0) {
        return res.status(404).json({ message: 'Carrito vacío' });
      }

      // Verificar que el dinero del usuario sea suficiente
      const user = await sql('SELECT * FROM users WHERE id = $1', [userId]);
      const total = await sql(
        'SELECT SUM(p.price * ci.quantity) FROM products p JOIN cart_items ci ON p.id = ci.product_id WHERE ci.cart_id = (SELECT id FROM carts WHERE user_id = $1)',
        [userId],
      );
      if (user[0].money < total[0].sum) {
        return res.status(400).json({ message: 'Dinero insuficiente' });
      }

      // Descontar dinero del usuario money
      await sql(
        'UPDATE users SET money = money - (SELECT SUM(p.price * ci.quantity) FROM products p JOIN cart_items ci ON p.id = ci.product_id WHERE ci.cart_id = (SELECT id FROM carts WHERE user_id = $1)) WHERE id = $1',
        [userId],
      );

      // Crear una venta en la tabla sales {user_id, amount}
      const sale = await sql(
        'INSERT INTO sales (user_id, amount) VALUES ($1, (SELECT SUM(p.price * ci.quantity) FROM products p JOIN cart_items ci ON p.id = ci.product_id WHERE ci.cart_id = (SELECT id FROM carts WHERE user_id = $1))) RETURNING *',
        [userId],
      );

      // Borra los productos del carrito
      await sql(
        'DELETE FROM cart_items WHERE cart_id = (SELECT id FROM carts WHERE user_id = $1)',
        [userId],
      );

      // Mensaje de compra exitosa
      res.status(201).json({ message: 'Compra exitosa', sale });
    } catch (error) {
      console.error('Error al realizar compra:', error);
      res.status(500).json({ message: 'Error del servidor' });
    }
  }
};
