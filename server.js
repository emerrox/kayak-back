// // server.js

// const express = require('express');
// const dotenv = require('dotenv');
// const { Sequelize } = require('sequelize');

// // Cargar las variables de entorno desde el archivo .env
// dotenv.config();

// // Inicializar la aplicación Express
// const app = express();
// const port = process.env.PORT || 5000;

// // Conectar a la base de datos MySQL con Sequelize
// const sequelize = new Sequelize(process.env.DB_URL, {
//   dialect: 'mysql',
//   logging: false, // Desactiva los logs de SQL
// });

// // Verificar conexión a la base de datos
// sequelize.authenticate()
//   .then(() => console.log('Conexión a la base de datos establecida correctamente.'))
//   .catch(err => console.error('No se pudo conectar a la base de datos:', err));

// // Middleware para analizar las solicitudes JSON
// app.use(express.json());

// // Rutas de ejemplo
// app.get('/', (req, res) => {
//   res.send('¡Hola desde el servidor Express!');
// });

// // Rutas adicionales (Ejemplo: grupos)
// app.get('/api/groups', (req, res) => {
//   // Aquí iría la lógica para obtener los grupos de la base de datos
//   res.json({ message: 'Listar grupos' });
// });

// // Iniciar el servidor
// app.listen(port, () => {
//   console.log(`Servidor corriendo en http://localhost:${port}`);
// });
// server.js
const express = require('express');
const dotenv = require('dotenv');
const mysql = require('mysql2');

// Cargar las variables de entorno desde el archivo .env
dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

// Configuración de la base de datos MySQL
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

// Conectar a la base de datos MySQL
db.connect((err) => {
  if (err) {
    console.error('Error de conexión a la base de datos:', err);
    return;
  }
  console.log('Conectado a la base de datos MySQL');
});

// Ruta de prueba para comprobar que el servidor está funcionando
app.get('/', (req, res) => {
  res.send('¡Hola, el servidor está funcionando correctamente!');
});

// Iniciar el servidor
app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});
