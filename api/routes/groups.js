import { Router } from 'express';
import { readJSON, writeJSON } from '../utils.js';
import authenticate from '../authenticate.js';

const router = Router();

router.get('/', authenticate, (req, res) => {
  const groups = readJSON('groups.json');
  res.json(groups);
});

router.get('/:id', authenticate, (req, res) => {
  const groups = readJSON('groups.json');
  const group = groups.find(g => g.id === req.params.id);
  if (group) {
    const users = readJSON('groups_users.json');
    let user = [];
    users.map((u) => {
      if (u.userId == req.params.id) {
        user.push(u.userId);
      }
    });
    group.users = user;
    res.json(group);
  } else {
    res.status(404).json({ message: 'Grupo no encontrado' });
  }
});

// Ruta para crear un nuevo grupo
router.post('/', authenticate, (req, res) => {
  const { name } = req.body;

  const groups = readJSON('groups.json');
  const newGroup = {
    id: (groups.length + 1).toString(),
    name: name
  };
  groups.push(newGroup);
  writeJSON('groups.json', groups);

  res.status(201).json(newGroup);
});

router.delete('/:id', authenticate, (req, res) => {
  let groups = readJSON('groups.json');
  groups = groups.filter(g => g.id !== req.params.id);
  writeJSON('groups.json', groups);

  let users_g = readJSON('groups_users.json');
  users_g = users_g.filter(u => u.groupId !== req.params.id);
  writeJSON('groups_users.json', users_g);

  res.json({ message: 'Grupo eliminado' });
});

export default router;
