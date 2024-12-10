import express from 'express';
import { readJSON } from '../utils.js';
import { OAuth2Client } from 'google-auth-library'; // Asegúrate de importar correctamente

const router = express.Router();

const CLIENT_ID = process.env.GOOGLE_CLIENT_ID || "743577440289-uokciaco2cu56pv6agdjo65p3q1qr2k2.apps.googleusercontent.com"; // Coloca aquí tu Client ID de Google

const client = new OAuth2Client(CLIENT_ID);

router.post('/', async (req, res) => {
  const { oauthToken } = req.body;

  if (!oauthToken) {
    return res.status(400).json({ error: "El token de OAuth es requerido. " + req.body });
  }

  try {
    const ticket = await client.verifyIdToken({
      idToken: oauthToken,
      audience: CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const email = payload?.email;
    
    if (!email) {
      return res.status(400).json({ error: "No se pudo obtener el correo del usuario." });
    }

    /////// TO DO: cambiar a base de datos

    const users = readJSON('users.json');
    const user = users.find((u) => u.email === email);

    ////////

    if (!user) {
      return res.status(402).json({ error: 'Credenciales inválidas' });
    }

    res.cookie('authToken', oauthToken, {
        httpOnly: true,
        secure: false, 
        maxAge: 1000 * 60 * 60, //
      })
      .status(200)
      .json({ message: 'Inicio de sesión exitoso ' + email });

  } catch (error) {
    console.error("Error al verificar el ID Token:", error);
    return res.status(401).json({ error: "Token de OAuth inválido." });
  }
});

export default router;
