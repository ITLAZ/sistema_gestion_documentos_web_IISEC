const express = require('express');
const path = require('path');

const app = express();
const port = 3001;

// Middleware to serve static files
app.use(express.static(path.join(__dirname)));

// Basic route to serve index.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Definir las rutas para redirección
app.get('/buscador', (req, res) => {
    res.send('<h1>Página del Buscador de Archivos</h1><p>Aquí puedes buscar archivos.</p>');
});

app.get('/agregar', (req, res) => {
    res.send('<h1>Página para Agregar Archivo</h1><p>Aquí puedes agregar un nuevo archivo.</p>');
});

app.get('/reportes', (req, res) => {
    res.send('<h1>Página de Reportes y Estadísticas</h1><p>Aquí puedes ver los reportes.</p>');
});


// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
