const { Router } = require('express');
const fs = require('fs');
const { readJSON, writeJSON } = require('../utils');
const path = require('path');
const router = Router();

// Ruta para obtener todos los grupos
router.get('/', (req, res) => {
  const groups = readJSON('groups.json');
  res.json(groups);
});

// Ruta para obtener un grupo por ID
router.get('/:id', (req, res) => {
  const groups = readJSON('groups.json')
  const group = groups.find(g => g.id === req.params.id);
  if (group) {
    res.json(group);
  } else {
    res.status(404).json({ message: 'Grupo no encontrado' });
  }
});

// Ruta para crear un nuevo grupo
router.post('/', (req, res) => {
  const groups = readJSON('groups.json')
  const { name } = req.body;
  const newGroup = {
    id: (groups.length + 1).toString(),
    name
  };
  groups.push(newGroup);
  writeJSON('groups.json',groups)
  res.status(201).json(newGroup);
});

// Ruta para eliminar un grupo por ID
router.delete('/:id', (req, res) => {
  let groups = readJSON('groups.json')
  groups = groups.filter(g => g.id !== req.params.id);
  writeJSON('groups.json', groups)
  res.json({ message: 'Grupo eliminado' });
});

module.exports = router;
