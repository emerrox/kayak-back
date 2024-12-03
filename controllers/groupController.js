// controllers/groupController.js
const Group = require('../models/group');

const getAllGroups = async (req, res) => {
  try {
    const groups = await Group.findAll();
    res.json(groups);
  } catch (err) {
    res.status(500).send('Error al obtener grupos');
  }
};

const createGroup = async (req, res) => {
  try {
    const { name } = req.body;
    const newGroup = await Group.create({ name });
    res.status(201).json(newGroup);
  } catch (err) {
    res.status(500).send('Error al crear grupo');
  }
};

module.exports = { getAllGroups, createGroup };
