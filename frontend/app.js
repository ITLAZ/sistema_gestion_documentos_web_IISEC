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
    res.sendFile(path.join(__dirname, 'templates', 'search.html'));
});

app.get('/agregar', (req, res) => {
    res.sendFile(path.join(__dirname, 'templates','agregar.html'));
});

app.get('/reportes', (req, res) => {
    res.sendFile(path.join(__dirname, 'templates','report.html'));
});


// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
