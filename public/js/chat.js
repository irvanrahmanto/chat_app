const socket = io();

// Elements
const $messageForm = document.querySelector('#message-form'); //untuk message form
const $messageFormInput = $messageForm.querySelector('input'); //untuk input field
const $messageFormButton = $messageForm.querySelector('button'); //untuk button
const $sendLocationbutton = document.querySelector('#send-location'); //untuk button send location
const $message = document.querySelector('#messages');

// Templates
const messageTemplate = document.querySelector('#message-template').innerHTML;
const locationmessageTemplate = document.querySelector('#location-message-template').innerHTML;

socket.on('message', (message) => {
    console.log(message);
    const html = Mustache.render(messageTemplate, {
        message
    });
    $message.insertAdjacentHTML('beforeend', html);
});

socket.on('locationMessage', (url) => {
    console.log(url);
    const html = Mustache.render(locationmessageTemplate, {
        url
    });
    $message.insertAdjacentHTML('beforeend', html);
});

// JQuery manipulation for button submit on form
$messageForm.addEventListener('submit', (e) => {
    e.preventDefault();

    $messageFormButton.setAttribute('disabled', 'disabled');

    // Callback function
    // const message = document.querySelector('input').value;
    const message = e.target.elements.message.value;
    // emit message
    socket.emit('sendMessage', message, (error) => {
        $messageFormButton.removeAttribute('disabled');
        $messageFormInput.value = '';
        $messageFormInput.focus();

        if (error) {
            return console.log(error);
        }

        console.log('Message delivered!');
    });
})

// JQuery manipulation for button send location outside the form
$sendLocationbutton.addEventListener('click', () => {
    if (!navigator.geolocation) {
        return alert('Sorry Geolocation is not supported by your browser');
    }

    $sendLocationbutton.setAttribute('disabled', 'disabled');

    navigator.geolocation.getCurrentPosition((position) => {
        // console.log(position);
        socket.emit('sendLocation', {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
        }, () => {
            $sendLocationbutton.removeAttribute('disabled');
            console.log('Location Shared!');
        });
    })
})