const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = 3000;

// Middleware para servir archivos estáticos (HTML, CSS, JS)
app.use(express.static(path.join(__dirname, 'public')));

// Ruta para obtener contenidos educativos (desde JSON)
app.get('/api/contenidos', (req, res) => {
  const filePath = path.join(__dirname, 'data', 'contenidos.json');
  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      res.status(500).json({ error: 'No se pudo cargar el contenido' });
    } else {
      res.json(JSON.parse(data));
    }
  });
});

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Servidor iniciado en http://localhost:${PORT}`);
});
