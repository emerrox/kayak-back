import express from 'express';
import { readJSON } from '../utils.js';
import { OAuth2Client } from 'google-auth-library'; // Asegúrate de importar correctamente
import { google } from 'googleapis';

const router = express.Router();

const client = new google.auth.OAuth2(process.env.CLIENT_ID, process.env.CLIENT_SECRET, process.env.REDIRECT_URI);


router.post('/', (req, res) => {
  const SCOPES = [
    'https://www.googleapis.com/auth/calendar',
    'https://www.googleapis.com/auth/calendar.events',
    'https://www.googleapis.com/auth/calendar.events.readonly',
    'https://www.googleapis.com/auth/calendar.readonly',
    'https://www.googleapis.com/auth/calendar.settings.readonly',
    'https://www.googleapis.com/auth/admin.directory.resource.calendar',
    'https://www.googleapis.com/auth/calendar.resources.readonly',
  ];
  const authUrl = client.generateAuthUrl({
    access_type: 'offline', 
    scope: 'https://www.googleapis.com/auth/calendar',
    prompt: 'consent'
  });

  res.redirect(authUrl);
});

router.post('/callback', async (req, res) => {
  const { oauthToken } = req.body;

  if (!oauthToken) {
    return res.status(400).json({ error: "El token de OAuth es requerido. " + req.body });
  }

  try {
    const { tokens } = await client.getToken(oauthToken);
    client.setCredentials(tokens);

    const ticket = await client.verifyIdToken({
      idToken: tokens.id_token,
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

    res.cookie('authToken', tokens.access_token, {
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

router.get('/callback', async (req, res) => {
  const { oauthToken } = req.body;

  if (!oauthToken) {
    return res.status(400).json({ error: "El token de OAuth es requerido. " + req.body });
  }

  try {
    const { tokens } = await client.getToken(oauthToken);
    client.setCredentials(tokens);

    const ticket = await client.verifyIdToken({
      idToken: tokens.id_token,
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

    res.cookie('authToken', tokens.access_token, {
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
