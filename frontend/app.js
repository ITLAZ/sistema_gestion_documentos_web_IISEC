const express = require('express');
const path = require('path');

const app = express();
const port = 3001;

// Middleware to serve static files
app.use(express.static(path.join(__dirname)));
app.use('/node_modules', express.static(path.join(__dirname, 'node_modules')));

// Middleware para pasar el tema a todas las rutas
app.use((req, res, next) => {
    const theme = req.cookies.theme || "light";  // Recuperar tema de cookies o default a 'light'
    res.locals.theme = theme;  // Guardar el tema en res.locals para usarlo en el HTML
    next();
});


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

app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'templates','login.html'));
});

app.get('/preview', (req, res) => {
    res.sendFile(path.join(__dirname, 'templates','vistadoc.html'));
});

app.get('/edits', (req, res) => {
    res.sendFile(path.join(__dirname, 'templates','editar.html'));
});

app.get('/usuarios', (req, res) => {
    res.sendFile(path.join(__dirname, 'templates','usuarios.html'));
});

app.get('/restore', (req, res) => {
    res.sendFile(path.join(__dirname, 'templates','restaurar.html'));
});

app.get('/mostlogs', (req, res) => {
    res.sendFile(path.join(__dirname, 'templates','mostrarlogs.html'));
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
