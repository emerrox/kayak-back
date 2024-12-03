const express = require("express");
const bodyParser = require("body-parser");
require("dotenv").config();

const usersRouter = require("./routes/users");
const groupsRouter = require("./routes/groups");

const app = express();
app.use(bodyParser.json());

// Rutas
app.use("/users", usersRouter);
app.use("/groups", groupsRouter);

// Iniciar el servidor
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});