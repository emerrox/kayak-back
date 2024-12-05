const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET || 'clave-secreta-por-defecto';

// Ruta para iniciar sesión
router.get('/', (req, res) => {
  const { email } = req.body;

  // Buscar usuario
  const user = readJSON('users.json').find((u) => u.email === email);

  if (!user) { 
    return res.status(401).json({ error: 'Credenciales inválidas' });
  }

  const token = jwt.sign({ id: user.id, username: user.username }, JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRATION || '1h', // Duración del token
  });

  res.json({ token });
});

module.exports = router;
