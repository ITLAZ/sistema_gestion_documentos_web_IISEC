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

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
