const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const usersRoutes = require('./routes/users');
const groupsRoutes = require('./routes/groups');
const groupsUsersRoutes = require('./routes/groups_users');
const loginRoutes = require('./routes/login')
const logoutRoutes = require('./routes/logout')
const helmet = require('helmet');

const app = express();

app.use(express.json());
app.use(helmet.referrerPolicy({ policy: 'unsafe-url' }))
app.use(cors({
  origin: (origin, callback) => {
    const ACCEPTED_ORIGINS = [
      'http://localhost:3000',
      'http://localhost:5173',
      'https://kayak-plus.vercel.app'
    ]

    if (ACCEPTED_ORIGINS.includes(origin)) {
      return callback(null, true)
    }

    if (!origin) {
      return callback(null, true)
    }

    return callback(new Error('Not allowed by CORS'))
  },
  credentials: true,
}))
app.disable('x-powered-by')
app.use(cookieParser())

app.use('/api/users', usersRoutes);
app.use('/api/groups', groupsRoutes);
app.use('/api/groups_users', groupsUsersRoutes);
app.use('/api/login', loginRoutes);
app.use('/api/logout', logoutRoutes);

  app.listen(3000, () => {
    console.log('Server running on http://localhost:3000');
  });

module.exports = app;
