import jwt from 'jsonwebtoken';

const clave = 'INSAAAID';

// middleware para verificar si el usuario ADMIN esta veri
export function verifyAdminToken(req, res, next) {
  const token = req.cookies.token;

  if (!token) {
    return res.status(403).json({
      ok: false,
      message: 'Se requiere autenticación de administrador.'
    });
  }

  try {
    // decodificacion del token
    const decoded = jwt.verify(token, clave);

    // verificacion del rol de administrador usando el atributo booleano
    if (!decoded.role) {
      return res.status(403).json({
        message: 'No tienes permisos para realizar esta acción.'
      });
    }

    // asignacion del usuario autenticado al objeto `req`
    req.user = decoded;
    next(); // permite el acceso a la ruta
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
      req.user = decoded; // asignacion del usuario autenticado
      next(); // permitir el acceso a la ruta
  } catch (error) {
      return res.status(401).json({ message: 'Token inválido.' });
  }
}
