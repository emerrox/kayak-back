const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'clave-secreta-por-defecto';  // Asegúrate de tener una clave secreta

// Middleware para verificar el token
const authenticate = (req, res, next) => {
  // Obtener el token del encabezado Authorization (Bearer token)
  const token = req.headers['authorization']?.split(' ')[1];

  if (!token) {
    return res.status(403).json({ error: 'No token provided' });  // No se proporciona token
  }

  // Verificar el token JWT
  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ error: 'Token no válido o expirado' });  // Token inválido
    }

    // Almacenamos el usuario decodificado para usarlo en las rutas si es necesario
    req.user = decoded;
    next();  // Continuamos con la ejecución de la ruta
  });
};

module.exports = authenticate;
