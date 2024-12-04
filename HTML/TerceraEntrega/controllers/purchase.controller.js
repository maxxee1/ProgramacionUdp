import sql from '../db.js';

export const purchaseController = {
  // realizar una compra
  makePurchase: async (req, res) => {
    const userId = req.user.id;
    try {
      // ver si tiene existe y de paso si tiene productos
      const cartExists = await sql('SELECT * FROM carts WHERE user_id = $1', [
        userId,
      ]);
      if (cartExists.length === 0) {
        return res.status(404).json({ message: 'Carrito vacío' });
      }
      // si no, le avisamos que esta vacio
      const cartItems = await sql(
        'SELECT * FROM cart_items WHERE cart_id = (SELECT id FROM carts WHERE user_id = $1)',
        [userId],
      );
      if (cartItems.length === 0) {
        return res.status(404).json({ message: 'Carrito vacío' });
      }

      // si la plata es suficiente continua, sino te manda el mensaje
      const user = await sql('SELECT * FROM users WHERE id = $1', [userId]);
      const total = await sql(
        'SELECT SUM(p.price * ci.quantity) FROM products p JOIN cart_items ci ON p.id = ci.product_id WHERE ci.cart_id = (SELECT id FROM carts WHERE user_id = $1)',
        [userId],
      );
      if (user[0].money < total[0].sum) {
        return res.status(400).json({ message: 'Dinero insuficiente' });
      }

      // le descuenta la plata(la actualiza restandole lo que sea que haya comprado de su carrito)
      await sql(
        'UPDATE users SET money = money - (SELECT SUM(p.price * ci.quantity) FROM products p JOIN cart_items ci ON p.id = ci.product_id WHERE ci.cart_id = (SELECT id FROM carts WHERE user_id = $1)) WHERE id = $1',
        [userId],
      );

      // crea una venta en la tabla sales {user_id, amount}
      const sale = await sql(
        'INSERT INTO sales (user_id, amount) VALUES ($1, (SELECT SUM(p.price * ci.quantity) FROM products p JOIN cart_items ci ON p.id = ci.product_id WHERE ci.cart_id = (SELECT id FROM carts WHERE user_id = $1))) RETURNING *',
        [userId],
      );

      // borra los productos del carrito
      await sql(
        'DELETE FROM cart_items WHERE cart_id = (SELECT id FROM carts WHERE user_id = $1)',
        [userId],
      );

      // le avisamos d su compra exitosa
      res.status(201).json({ message: 'Compra exitosa', sale });
    } catch (error) {
      console.error('Error al realizar compra:', error);
      res.status(500).json({ message: 'Error del servidor' });
    }
  }
};
