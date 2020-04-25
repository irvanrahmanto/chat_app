const socket = io();

socket.on('message', (message) => {
    console.log(message);
});

// JQuery manipulation for button submit on form
document.querySelector('#message-form').addEventListener('submit', (e) => {
    e.preventDefault();

    // Callback function
    // const message = document.querySelector('input').value;
    const message = e.target.elements.message.value;
    // emit message
    socket.emit('sendMessage', message);
})

// JQuery manipulation for button send location outside the form
document.querySelector('#send-location').addEventListener('click', () => {
    if (!navigator.geolocation) {
        return alert('Sorry Geolocation is not supported by your browser');
    }

    navigator.geolocation.getCurrentPosition((position) => {
        // console.log(position);
        socket.emit('sendLocation', {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
        });
    })
})