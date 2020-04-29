// inisialisasi depedency
const express = require('express');
const path = require('path');
const http = require('http');
const socketio = require('socket.io');
const Filter = require('bad-words');

const { generateMessage, generateLocationMessage } = require('../src/utils/message');
const { addUser, removeUser, getUser, getUsersInRoom } = require('./utils/users');

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

    socket.on('join', (options, callback) => {
        const { error, user } = addUser({ id: socket.id, ...options })

        if (error) {
            return callback(error)
        }

        socket.join(user.room)

        // If user succes joined 
        socket.emit('message', generateMessage('Admin', 'welcome!'));
        socket.broadcast.to(user.room).emit('message', generateMessage('Admin', `${user.username} has joined!`));

        callback()
    })

    // sending message
    socket.on('sendMessage', (message, callback) => {
        const user = getUser(socket.id);

        // checking bad words
        const filter = new Filter();

        if (filter.isProfane(message)) {
            return callback('profanity is not allowed!');
        }

        io.to(user.room).emit('message', generateMessage(user.username, message));
        // for using acknowledgement
        // callback('Delivered');
        callback();
    });

    // sending current location, get latitude and longitude from geolocation api and sending that api to google maps
    socket.on('sendLocation', (coords, callback) => {
        const user = getUser(socket.id);
        io.to(user.room).emit('locationMessage', generateLocationMessage(user.username, `https://google.com/maps?q=${coords.latitude},${coords.longitude}`));
        callback();
    })

    // If user left joined
    socket.on('disconnect', () => {
        const user = removeUser(socket.id)

        if (user) {
            io.to(user.room).emit('message', generateMessage('Admin', `${user.username} user has left!`));
        }
        // io.emit('message', generateMessage('a user has left!'));
    })
});

server.listen(PORT, () => {
    console.log("Server running at " + PORT + "!!");
});