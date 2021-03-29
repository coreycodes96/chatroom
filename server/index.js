const express = require('express');
const socket = require('socket.io');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());

const server = app.listen(3000, () => {
    console.log('Connected to port: 3000');
})

io = socket(server, {
    cors:{
        origin: '*',
    }
});

io.on('connection', (socket) => {
    socket.on('join_room', (data) => {
        socket.join(data);
    })

    socket.on('send_message', (data) => {
        socket.to(data.room).emit('receive_message', {'username': data.username, 'message': data.message});
    })
    
    socket.on('disconnect', () => {
        console.log('The user has left the room');
    })
})