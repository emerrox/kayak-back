const express = require("express");
const router = express.Router();
const db = require("../db");

// Crear un nuevo grupo
router.post("/", (req, res) => {
  const { name } = req.body;

  const query = "INSERT INTO groups_data (name) VALUES (?)";
  db.query(query, [name], (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).send("Error creando grupo");
    } else {
      res.status(201).json({ id: result.insertId, name });
    }
  });
});

// Agregar usuario a un grupo
router.post("/:groupId/addUser", (req, res) => {
  const { groupId } = req.params;
  const { userId } = req.body;

  const query = "INSERT INTO group_users (group_id, user_id) VALUES (?, ?)";
  db.query(query, [groupId, userId], (err) => {
    if (err) {
      console.error(err);
      res.status(500).send("Error agregando usuario al grupo");
    } else {
      res.status(200).send("Usuario agregado al grupo");
    }
  });
});

module.exports = router;
