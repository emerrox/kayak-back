import express from 'express';
import fetch from 'node-fetch';


const router = express.Router();

router.post('/', async (req, res) => {
  const { access_token } = req.body;

  if (!access_token) {
    return res.status(400).json({ error: "El token de OAuth es requerido." });
  }

  try {
    const response = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${access_token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Error al obtener la información del usuario de Google');
    }

    const userInfo = await response.json();

    const userEmail = userInfo.email;

    res
      .cookie('access_token', access_token, {
        secure: true, 
        sameSite: 'None',
        maxAge: 1000 * 60 * 60,
      })
      .cookie('user_email', userEmail, {
        secure: true, 
        sameSite: 'None',
        maxAge: 1000 * 60 * 60,
      })
      .status(200)
      .json({
        message: 'Inicio de sesión exitoso',
        token: access_token,
        email: userEmail,
      });

  } catch (err) {
    console.error('Error:', err);
    return res.status(500).json({ error: 'Error al procesar la autenticación.' });
  }
});

export default router;
