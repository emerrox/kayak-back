const express = require("express");
const router = express.Router();
const db = require("../db");

// Crear un nuevo usuario
router.post("/", (req, res) => {
  const { name, email } = req.body;

  const query = "INSERT INTO users (name, email) VALUES (?, ?)";
  db.query(query, [name, email], (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).send("Error creando usuario");
    } else {
      res.status(201).json({ id: result.insertId, name, email });
    }
  });
});

// Obtener todos los usuarios
router.get("/", (req, res) => {
  const query = "SELECT * FROM users";
  db.query(query, (err, results) => {
    if (err) {
      console.error(err);
      res.status(500).send("Error obteniendo usuarios");
    } else {
      res.json(results);
    }
  });
});

module.exports = router;
