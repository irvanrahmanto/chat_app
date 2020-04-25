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
io.on('connection', (socket) => {
    console.log('Success create socket connection');

    // If user succes joined 
    socket.emit('message', 'welcome!');
    socket.broadcast.emit('message', 'A new user has been joined!');

    // sending message
    socket.on('sendMessage', (message) => {
        io.emit('message', message);
    });

    // sending current location, get latitude and longitude from geolocation api and sending that api to google maps
    socket.on('sendLocation', (coords) => {
        io.emit('message', `https://google.com/maps?q=${coords.latitude},${coords.longitude}`);
    })

    // If user left joined
    socket.on('disconnect', () => {
        io.emit('message', 'a user has left!');
    })
});

server.listen(PORT, () => {
    console.log("Server running at " + PORT + "!!");
});