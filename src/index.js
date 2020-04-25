// inisialisasi depedency
const express = require('express');
const path = require('path');

const app = express();

// penggunaan depedency
const PORT = process.env.PORT || 3000;
const publicDirectoryPath = path.join(__dirname, '../public');

// Serve up the public directory
app.use(express.static(publicDirectoryPath));

// Error handling
app.listen(PORT, () => {
    console.log("Server running at " + PORT + "!!");
});