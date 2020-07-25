const express = require('express');
const app = express();
var http = require('http').createServer(app);
var io = require('socket.io')(http);

const port = 3000;
let users = new Map();
let rooms = [];
let messages = [];

app.get('/', (req, res) => res.send('Hello World!'));

io.on('connection', (socket) => {
  console.log('a user connected');
  io.emit('new user connected', getUsers());

  // agregar usuario
  socket.on('new user', (data) => {
    console.log('new user',data);
    users.set(data.user.toLowerCase().trim(), data.user);
    socket.broadcast.emit('new user connected', getUsers());
  });

  // crear chat entre usuario
  socket.on('new room', (data) => {
    console.log('new room',data);
    rooms.push(data.room);
    socket.join(data.room);
  });

  // mensaje
  socket.on('message', data => {
    console.log('message',data);
    messages.push(data);
    io.in(data.room).emit('new message', data);
  })

  // salir del chat
});

function getUsers() {
  const data = [];
  users.forEach(user => data.push(user));
  return data;
}

http.listen(port, () => console.log(`Example app listening at http://localhost:${port}`));