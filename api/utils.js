const fs = require('fs');
const path = require('path');

const readJSON = (fileName) => {
  const filePath = path.join(__dirname, '../data', fileName);
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
};

const writeJSON = (fileName, data) => {
  const filePath = path.join(__dirname, '../data', fileName);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
};

module.exports = { readJSON, writeJSON };
