const { Router } = require('express');
const { readJSON, writeJSON } = require('../utils');
const router = Router();

router.get('/', (req, res) => {
  const users = readJSON('users.json');
  res.json(users);
});

router.get('/:id', (req, res) => {
  const users = readJSON('users.json');
  const user = users.find(u => u.id === req.params.id);
  if (user) {
    const groups = readJSON('groups_users.json')
    let group = []
    groups.map((g)=>{
      if (g.userId==req.params.id) {
        group.push(g.groupId)
      }
    })
    user.groups = group
    res.json(user);
  } else {
    res.status(404).json({ message: 'Usuario no encontrado' });
  }
});

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

router.delete('/:id', (req, res) => {
  let users = readJSON('users.json');
  users = users.filter(u => u.id !== req.params.id);
  writeJSON('users.json', users);

  let users_g = readJSON('groups_users.json');
  users_g = users_g.filter(u => u.userId !== req.params.id);
  writeJSON('groups_users.json', users_g);

  res.json({ message: 'Usuario eliminado' });
});

module.exports = router;
