const { Router } = require('express');
const fs = require('fs');
const path = require('path');
const router = Router();

// Ruta para obtener todos los grupos
router.get('/', (req, res) => {
  const groups = JSON.parse(fs.readFileSync(path.join(__dirname, '../../data/groups.json')));
  res.json(groups);
});

// Ruta para obtener un grupo por ID
router.get('/:id', (req, res) => {
  const groups = JSON.parse(fs.readFileSync(path.join(__dirname, '../../data/groups.json')));
  const group = groups.find(g => g.id === req.params.id);
  if (group) {
    res.json(group);
  } else {
    res.status(404).json({ message: 'Grupo no encontrado' });
  }
});

// Ruta para crear un nuevo grupo
router.post('/', (req, res) => {
  const groups = JSON.parse(fs.readFileSync(path.join(__dirname, '../../data/groups.json')));
  const { name } = req.body;
  const newGroup = {
    id: (groups.length + 1).toString(),
    name
  };
  groups.push(newGroup);
  fs.writeFileSync(path.join(__dirname, '../../data/groups.json'), JSON.stringify(groups, null, 2));
  res.status(201).json(newGroup);
});

// Ruta para eliminar un grupo por ID
router.delete('/:id', (req, res) => {
  let groups = JSON.parse(fs.readFileSync(path.join(__dirname, '../../data/groups.json')));
  groups = groups.filter(g => g.id !== req.params.id);
  fs.writeFileSync(path.join(__dirname, '../../data/groups.json'), JSON.stringify(groups, null, 2));
  res.json({ message: 'Grupo eliminado' });
});

module.exports = router;
