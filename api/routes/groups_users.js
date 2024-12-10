import { Router } from 'express';
import authenticate from '../authenticate.js';
import { readJSON, writeJSON } from '../utils.js';

const router = Router();

router.get('/', authenticate, (req, res) => {
  const groupsUsers = readJSON('groups_users.json');
  res.json(groupsUsers);
});

router.post('/', authenticate, (req, res) => {
  const groupsUsers = readJSON('groups_users.json');
  const { userId, groupId } = req.body;
  const newRelation = { userId, groupId };
  groupsUsers.push(newRelation);
  writeJSON('groups_users.json', groupsUsers);
  res.status(201).json(newRelation);
});

router.delete('/', authenticate, (req, res) => {
  const { userId, groupId } = req.body;
  let groupsUsers = readJSON('groups_users.json');
  groupsUsers = groupsUsers.filter(r => r.userId !== userId || r.groupId !== groupId);
  writeJSON('groups_users.json', groupsUsers);
  res.json({ message: 'Relación eliminada' });
});

export default router;
