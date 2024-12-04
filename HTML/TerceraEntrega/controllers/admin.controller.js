import sql from '../db.js';

export const adminController = {
  // saca el total de la plata en ventas
  getTotal: async (req, res) => {
    try {
      const money = await sql('SELECT SUM(amount) AS total FROM sales');
      const total = money[0].total; // verifica que esto agarre bien la fila y columna
      res.status(200).json({ total });
    } catch (error) {
      console.error('Error al obtener las ganancias y productos:', error);
      res.status(500).json({ message: 'Error del servidor' });
    }
  },

  // mete un producto nuevo a la base
  addNewProduct: async (req, res) => {
    const { stock, name, price, image_path, description } = req.body;
    try {
      const newProduct = await sql(
        'INSERT INTO products (stock, name, price, image_path, description) VALUES ($1, $2, $3, $4, $5) RETURNING *',
        [stock, name, price, image_path, description],
      );
      res.status(201).json({ message: 'Producto agregado', product: newProduct[0] });
    } catch (error) {
      console.error('Error al agregar producto:', error);
      res.status(500).json({ message: 'Error del servidor' });
    }
  },

  // lo elimina de bd
  deleteProduct: async (req, res) => {
    const { id } = req.params;
    try {
      const result = await sql(
        'DELETE FROM products WHERE id = $1 RETURNING *',
        [id],
      );
      if (result.length === 0) {
        return res.status(404).json({ message: 'Producto no encontrado' });
      }
      res.status(200).json({ message: 'Producto eliminado exitosamente' });
    } catch (error) {
      console.error('Error al eliminar producto:', error);
      res.status(500).json({ message: 'Error del servidor' });
    }
  },

  // actualiza los datos de un producto en la base
  updateProduct: async (req, res) => {
    const { id } = req.params;
    const { stock, name, price, image_path, description } = req.body;
    try {
      const result = await sql(
        'UPDATE products SET stock = $1, name = $2, price = $3, image_path = $4, description = $5 WHERE id = $6 RETURNING *',
        [stock, name, price, image_path, description, id],
      );
      if (result.length === 0) {
        return res.status(404).json({ message: 'Producto no encontrado' });
      }
      res.status(200).json({ message: 'Producto actualizado exitosamente', product: result[0] });
    } catch (error) {
      console.error('Error al actualizar producto:', error);
      res.status(500).json({ message: 'Error del servidor' });
    }
  },
};
