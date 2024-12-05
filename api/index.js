const express = require('express');
const usersRoutes = require('./routes/users');
const groupsRoutes = require('./routes/groups');
const groupsUsersRoutes = require('./routes/groups_users');

const app = express();
app.use(express.json());

// Montar las rutas
app.use('/api/users', usersRoutes);
app.use('/api/groups', groupsRoutes);
app.use('/api/groups_users', groupsUsersRoutes);

// Iniciar el servidor (solo para desarrollo local)
  app.listen(3000, () => {
    console.log('Server running on http://localhost:3000');
  });

module.exports = app;
