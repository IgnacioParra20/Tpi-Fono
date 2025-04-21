const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = 3000;

// Middleware para servir archivos estáticos (HTML, CSS, JS, imágenes, etc.)
app.use(express.static(path.join(__dirname, 'public')));

// Ruta para obtener contenidos del JSON (cuestionario)
app.get('/api/contenidos', (req, res) => {
  const filePath = path.join(__dirname, 'public', 'data', 'contenidos.json');
  
  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      console.error("Error al leer contenidos:", err);
      res.status(500).json({ error: 'No se pudo cargar el contenido.' });
    } else {
      try {
        const jsonData = JSON.parse(data);
        res.json(jsonData);
      } catch (parseError) {
        console.error("Error al parsear JSON:", parseError);
        res.status(500).json({ error: 'Error en el formato del archivo de contenidos.' });
      }
    }
  });
});

// Ruta raíz: redirige al inicio de sesión (inicio.html)
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'inicio.html'));
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`🟢 Servidor iniciado: http://localhost:${PORT}`);
});
