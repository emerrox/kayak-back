const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
// const rateLimit = require('express-rate-limit');
const cookieParser = require('cookie-parser');
const usersRoutes = require('./routes/users');
const groupsRoutes = require('./routes/groups');
const groupsUsersRoutes = require('./routes/groups_users');
const loginRoutes = require('./routes/login')
const logoutRoutes = require('./routes/logout')
// require('dotenv').config();
const app = express();
app.use(express.json());

// app.use(helmet.referrerPolicy({ policy: 'strict-origin-when-cross-origin' }));
const allowedOrigins = [
  'http://localhost:5173',       // Origen de desarrollo
  'https://kayak-plus.vercel.app' // Origen de producción
];

app.use(cors({
  origin: function (origin, callback) {
    if (allowedOrigins.includes(origin)) {
      callback(null, true); // Permitir el origen
    } else {
      callback(new Error('Not allowed by CORS')); // Rechazar otros orígenes
    }
  },
  credentials: true
}));
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
