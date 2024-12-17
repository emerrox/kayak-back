import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import usersRoutes from './routes/users.js';
import groupsRoutes from './routes/groups.js';
import groupsUsersRoutes from './routes/groups_users.js';
import loginRoutes from './routes/login.js';
import logoutRoutes from './routes/logout.js';
import eventsRoutes from './routes/events.js';
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
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Access-Control-Allow-Origin'],
  credentials: true
}));

app.disable('x-powered-by');

app.use('/api/users', usersRoutes);
app.use('/api/groups', groupsRoutes);
app.use('/api/groups_users', groupsUsersRoutes);
app.use('/api/login', loginRoutes);
app.use('/api/logout', logoutRoutes);
app.use('/api/events', eventsRoutes);

app.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});

export default app;
