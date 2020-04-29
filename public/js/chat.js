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
const sidebarTemplate = document.querySelector('#sidebar-template').innerHTML;

// Options
const { username, room } = Qs.parse(location.search, { ignoreQueryPrefix: true })

// autoscroll
const autoscroll = () => {
    // new message element
    const $newMessage = $message.lastElementChild

    // height of the new message
    const newMessageStyles = getComputedStyle($newMessage)
    const newMessageMargin = parseInt(newMessageStyles.marginBottom)
    const newMessageHeight = $newMessage.offsetHeight + newMessageMargin

    // visible height
    const visibleHeight = $message.offsetHeight

    // height of message container
    const containerHeight = $message.scrollHeight

    // how far i have scrolled
    const scrollOfSet = $message.scrollTop + visibleHeight

    if (containerHeight - newMessageHeight <= scrollOfSet) {
        $message.scrollTop = $message.scrollHeight
    }
}

socket.on('message', (message) => {
    console.log(message);
    const html = Mustache.render(messageTemplate, {
        username: message.username,
        message: message.text,
        createdAt: moment(message.createdAt).format('h:mm a')
    });
    $message.insertAdjacentHTML('beforeend', html);

    // call autscroll function
    autoscroll();
});

socket.on('locationMessage', (message) => {
    console.log(message);
    const html = Mustache.render(locationmessageTemplate, {
        username: message.username,
        url: message.url,
        createdAt: moment(message.createdAt).format('h:mm a')
    });
    $message.insertAdjacentHTML('beforeend', html);

    // call autscroll function
    autoscroll();
});

socket.on('roomData', ({ room, users }) => {
    // console.log(room)
    // console.log(users)
    const html = Mustache.render(sidebarTemplate, {
        room,
        users
    });

    document.querySelector('#sidebar').innerHTML = html;
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

socket.emit('join', { username, room }, (error) => {

    if (error) {
        alert(error)
        location.href = '/'
    }
})