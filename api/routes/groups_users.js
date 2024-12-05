const { Router } = require('express');
const router = Router();
const { readJSON, writeJSON } = require('../utils');

router.get('/', (req, res) => {
  const groupsUsers = JSON.parse(fs.readFileSync(path.join(__dirname, '../data/groups_users.json')));
  res.json(groupsUsers);
});

router.post('/', (req, res) => {
  const groupsUsers = readJSON('groups_users.json')
  const { userId, groupId } = req.body;
  const newRelation = { userId, groupId };
  groupsUsers.push(newRelation);
  writeJSON('groups_users.json',groupsUsers)
  res.status(201).json(newRelation);
});

router.delete('/', (req, res) => {
  const { userId, groupId } = req.body;
  let groupsUsers = readJSON('groups_users.json')
  groupsUsers = groupsUsers.filter(r => r.userId !== userId || r.groupId !== groupId);
  writeJSON('groups_users.json',groupsUsers)
  res.json({ message: 'Relación eliminada' });
});

module.exports = router;
