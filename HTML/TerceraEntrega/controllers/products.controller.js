import sql from '../db.js';

export const productsController = {
  // obtiene todos los productos
  getAllProducts: async (req, res) => {
    try {
      const products = await sql('SELECT * FROM products');
      res.status(200).json(products);
    } catch (error) {
      console.error('Error al obtener productos:', error);
      res.status(500).json({ message: 'Error del servidor' });
    }
  },

  // obtiene un producto en especifico con su id
  getProduct: async (req, res) => { 
    const { id } = req.params; // es el id desde los parametros de la ruta
    try {
      const product = await sql('SELECT * FROM products WHERE id = $1', [id]);
      //en caso que no este este producto
      if (product.length > 0) {
        res.status(200).json({ message: 'Producto encontrado', product: product[0] });
      } else {
        res.status(404).json({ message: 'Producto no encontrado' });
      }
    } catch (error) {
      console.error('Error al obtener producto:', error);
      res.status(500).json({ message: 'Error del servidor' });
    }
  }

};
