import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import groupsRoutes from './routes/groups.js';
import groupsUsersRoutes from './routes/groups_users.js';
import loginRoutes from './routes/login.js';
import eventsRoutes from './routes/events.js';
import invitesRoutes from './routes/invites.js';
import helmet from 'helmet';
import dotenv from 'dotenv';

dotenv.config();
const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(helmet.referrerPolicy({ policy: 'unsafe-url' }));
app.use(cors({
  origin: (origin, callback) => {
    const ACCEPTED_ORIGINS = [
      'http://localhost:3000',
      'http://localhost:5173',
      'http://localhost:5173/home',
      'https://kayak-plus.vercel.app',
      'https://kayak-back.vercel.app',
      'https://kayak-plus.vercel.app/home'
    ];

    if (ACCEPTED_ORIGINS.includes(origin)) {
      return callback(null, true);
    }

    if (!origin) {
      return callback(null, true);
    }

    return callback(new Error('Not allowed by CORS'));
  },
  methods: ['GET', 'POST', 'OPTIONS', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Access-Control-Allow-Origin'],
}));

app.disable('x-powered-by');

app.use('/api/groups', groupsRoutes);
app.use('/api/groupsUsers', groupsUsersRoutes);
app.use('/api/login', loginRoutes);
app.use('/api/events', eventsRoutes);
app.use('/api/invites', invitesRoutes);

app.listen(process.env.PORT);

export default app;
