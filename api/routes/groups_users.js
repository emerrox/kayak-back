const { Router } = require('express');
const fs = require('fs');
const path = require('path');
const router = Router();

// Ruta para obtener todas las relaciones entre usuarios y grupos
router.get('/', (req, res) => {
  const groupsUsers = JSON.parse(fs.readFileSync(path.join(__dirname, '../data/groups_users.json')));
  res.json(groupsUsers);
});

// Ruta para crear una nueva relación entre usuario y grupo
router.post('/', (req, res) => {
  const groupsUsers = JSON.parse(fs.readFileSync(path.join(__dirname, '../data/groups_users.json')));
  const { userId, groupId } = req.body;
  const newRelation = { userId, groupId };
  groupsUsers.push(newRelation);
  fs.writeFileSync(path.join(__dirname, '../data/groups_users.json'), JSON.stringify(groupsUsers, null, 2));
  res.status(201).json(newRelation);
});

// Ruta para eliminar una relación entre usuario y grupo
router.delete('/', (req, res) => {
  const { userId, groupId } = req.body;
  let groupsUsers = JSON.parse(fs.readFileSync(path.join(__dirname, '../data/groups_users.json')));
  groupsUsers = groupsUsers.filter(r => r.userId !== userId || r.groupId !== groupId);
  fs.writeFileSync(path.join(__dirname, '../data/groups_users.json'), JSON.stringify(groupsUsers, null, 2));
  res.json({ message: 'Relación eliminada' });
});

module.exports = router;
