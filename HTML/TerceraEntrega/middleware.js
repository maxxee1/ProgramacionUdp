import jwt from 'jsonwebtoken';

const clave = 'INSAAAID';

// Middleware para verificar si el usuario ADMIN está autenticado
export function verifyAdminToken(req, res, next) {
  const token = req.cookies.token;

  if (!token) {
    return res.status(403).json({
      ok: false,
      message: 'Se requiere autenticación de administrador.'
    });
  }

  try {
    // Decodificación del token
    const decoded = jwt.verify(token, clave);

    // Verificación del rol de administrador usando el atributo booleano
    if (!decoded.role) {
      return res.status(403).json({
        message: 'No tienes permisos para realizar esta acción.'
      });
    }

    // Asignación del usuario autenticado al objeto `req`
    req.user = decoded;
    next(); // Permite el acceso a la ruta
  } catch (error) {
    return res.status(401).json({ message: 'Token inválido.' });
  }
}

export function verifyUserToken(req, res, next) {
  const token = req.cookies.token;

  if (!token) {
      return res.status(403).json({
          ok: false,
          message: 'Se requiere autenticación.'
      });
  }

  try {
      const decoded = jwt.verify(token, clave);
      req.user = decoded; // Asignación del usuario autenticado
      next(); // Permitir el acceso a la ruta
  } catch (error) {
      return res.status(401).json({ message: 'Token inválido.' });
  }
}
