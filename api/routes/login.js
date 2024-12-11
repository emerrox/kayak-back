import express from 'express';
import { readJSON } from '../utils.js';
import { OAuth2Client } from 'google-auth-library'; // Asegúrate de importar correctamente
import { google } from 'googleapis';

const router = express.Router();

const client = new OAuth2Client(process.env.CLIENT_ID, process.env.GOOGLE_CLIENT_SECRET);

router.post('/', async (req, res) => {
  const { oauthToken } = req.body;

  if (!oauthToken) {
    return res.status(400).json({ error: "El token de OAuth es requerido. " + req.body });
  }

  try {
    const ticket = await client.verifyIdToken({
      idToken: oauthToken,
      audience: process.env.CLIENT_ID,
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
        // httpOnly: true,
        secure: true, 
        sameSite: 'None',
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
