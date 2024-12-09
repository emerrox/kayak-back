const cookieParser = require('cookie-parser');
const { Router } = require('express');
const router = Router();
router.post('/', (req, res) => {
    res.clearCookie('authToken', {
        httpOnly: true,
        secure: false, // Configura secure según el entorno
      });
    res.status(200).json({ message: 'Cierre de sesión exitoso' });
  });

  module.exports = router;
