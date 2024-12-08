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

app.use(helmet.referrerPolicy({ policy: 'strict-origin-when-cross-origin' }));
app.use(cors({
  origin: 'http://localhost:5173',  // Cambia esta URL por la de tu frontend
  credentials: true,  // Permite el envío de cookies (importante para sesiones)
}));
app.use(cookieParser());

app.use('/api/users', usersRoutes);
app.use('/api/groups', groupsRoutes);
app.use('/api/groups_users', groupsUsersRoutes);
app.use('/api/login', loginRoutes);
app.use('/api/logout', logoutRoutes);

  app.listen(3000, () => {
    console.log('Server running on http://localhost:3000');
  });

module.exports = app;
