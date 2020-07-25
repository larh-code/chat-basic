const express = require('express');
const app = express();
var http = require('http').createServer(app);
var io = require('socket.io')(http);

const port = 3000;
let users = [];
let rooms = [];
let messages = [];

app.get('/', (req, res) => res.send('Hello World!'));

io.on('connection', (socket) => {
  console.log('a user connected');

  // agregar usuario
  socket.on('new user', (data) => {
    users.push(data.user);

    socket.broadcast.emit('new user connected', users);
  });

  // crear chat entre usuario
  socket.on('new room', (data) => {
    rooms.push(data.room);

    socket.join(data.room);
  });

  // mensaje
  socket.on('message', data => {
    messages.push(data);
    io.in(data.room).emit('new message', {user: data.user, message: data.message});
  })

  // salir del chat
});

http.listen(port, () => console.log(`Example app listening at http://localhost:${port}`));