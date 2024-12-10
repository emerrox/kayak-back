import fs from 'fs';
import path from 'path';

// Simplemente resolvemos la ruta hacia la carpeta 'data' desde el directorio raíz del proyecto
const dataDir = path.resolve('data'); // Esto asume que 'data' está en la raíz del proyecto

const readJSON = (fileName) => {
  const filePath = path.join(dataDir, fileName);
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
};

const writeJSON = (fileName, data) => {
  const filePath = path.join(dataDir, fileName);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
};

export { readJSON, writeJSON };
