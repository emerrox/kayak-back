const { Router } = require('express');
const { readJSON, writeJSON } = require('../utils');
const router = Router();

// Ruta para obtener todos los usuarios
router.get('/', (req, res) => {
  const users = readJSON('users.json');
  res.json(users);
});

// Ruta para obtener un usuario por ID
router.get('/:id', (req, res) => {
  const users = readJSON('users.json');
  const user = users.find(u => u.id === req.params.id);
  if (user) {
    res.json(user);
  } else {
    res.status(404).json({ message: 'Usuario no encontrado' });
  }
});

// Ruta para crear un nuevo usuario
router.post('/', (req, res) => {
  const users = readJSON('users.json');
  const { name, email } = req.body;
  const newUser = {
    id: (users.length + 1).toString(),
    name,
    email
  };
  users.push(newUser);
  writeJSON('users.json', users);
  res.status(201).json(newUser);
});

// Ruta para eliminar un usuario por ID
router.delete('/:id', (req, res) => {
  let users = readJSON('users.json');
  users = users.filter(u => u.id !== req.params.id);
  writeJSON('users.json', users);
  res.json({ message: 'Usuario eliminado' });
});

module.exports = router;
