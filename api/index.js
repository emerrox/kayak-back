import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import usersRoutes from './routes/users.js';
import groupsRoutes from './routes/groups.js';
import groupsUsersRoutes from './routes/groups_users.js';
import loginRoutes from './routes/login.js';
import logoutRoutes from './routes/logout.js';
import helmet from 'helmet';
import dotenv from 'dotenv';

dotenv.config();
const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(helmet.referrerPolicy({ policy: 'unsafe-url' }));
app.use(cors({
  origin: (origin, callback) => {
    const allowedFrontendDomain = 'kayak-plus.vercel.app';  // Dominio de frontend
    const allowedBackendDomain = 'kayak-back.vercel.app';   // Dominio de backend
    const googleDomain = 'accounts.google.com';             // Dominio de Google

    // Permitir todos los subdominios de kayak-plus.vercel.app (frontend)
    if (!origin || origin.endsWith(allowedFrontendDomain)) {
      callback(null, true); // Permite la solicitud
    }

    // Permitir todos los subdominios de kayak-back.vercel.app (backend)
    else if (origin.endsWith(allowedBackendDomain)) {
      callback(null, true); // Permite la solicitud
    }

    // Permitir todos los subdominios de accounts.google.com (para OAuth)
    else if (origin && origin.includes(googleDomain)) {
      callback(null, true); // Permite la solicitud desde cualquier subdominio de google.com
    }

    // Si no coincide con ningún dominio permitido, rechaza la solicitud
    else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

app.disable('x-powered-by');

app.use('/api/users', usersRoutes);
app.use('/api/groups', groupsRoutes);
app.use('/api/groups_users', groupsUsersRoutes);
app.use('/api/login', loginRoutes);
app.use('/api/logout', logoutRoutes);

app.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});

export default app;
