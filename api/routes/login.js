import express from 'express';
import { readJSON } from '../utils.js';
import { OAuth2Client } from 'google-auth-library'; // Asegúrate de importar correctamente
import { google } from 'googleapis';
import { jwtDecode } from "jwt-decode";

const router = express.Router();

router.post('/', async (req, res) => {
  const { access_token } = req.body;

  if (!access_token) {
    return res.status(400).json({ error: "El token de OAuth es requerido. " + req.query });
  }


      res.cookie('access_token', access_token, {
        // httpOnly: true,
        secure: true, 
        sameSite: 'None',
        maxAge: 1000 * 60 * 60, //
      })
      .status(200)
      .json({ message: 'Inicio de sesión exitoso ',
              token: access_token,
       });

    // res.redirect('/home')
});

export default router;
