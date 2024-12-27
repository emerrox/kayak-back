import { OAuth2Client } from 'google-auth-library'; // Para verificación de tokens de Google
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';

dotenv.config();  // Cargar variables de entorno desde .env

const authenticate = async (req, res, next) => {
  const authToken = req.cookies.authToken;  // Obtener el token de las cookies
  // return resstatus(403).json({movida: req})
  

  if (!authToken) {  // Si no se encuentra el token
    return res.status(403).json({ error: 'Acceso denegado: No se encuentra el token de autenticación.' });
  }

  try {
    // Verificar el token utilizando la google-auth-library
    const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);  // Cliente OAuth con el Client ID
    await client.verifyIdToken({
      idToken: authToken,
      audience: process.env.GOOGLE_CLIENT_ID,  // Asegurarse de que el token sea para el client ID correcto
    });

    // Si la verificación es exitosa, continuar con la solicitud
    console.log('Token verificado con éxito');
    next();  // Continuar con la siguiente función en la cadena de middleware
  } catch (error) {
    console.error('Error al verificar el token:', error);
    return res.status(403).json({ error: 'Token de autenticación inválido o expirado.' });
  }
};

export default authenticate;
