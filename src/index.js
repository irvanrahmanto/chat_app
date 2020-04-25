// inisialisasi depedency
const express = require('express');
const path = require('path');
const http = require('http');
const socketio = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

// penggunaan depedency
const PORT = process.env.PORT || 3000;
const publicDirectoryPath = path.join(__dirname, '../public');

// Serve up the public directory
app.use(express.static(publicDirectoryPath));

// Error handling
io.on('connection', () => {
    console.log('Success create socket connection');
});

server.listen(PORT, () => {
    console.log("Server running at " + PORT + "!!");
});