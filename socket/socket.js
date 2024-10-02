let { Server } = require('socket.io');
let http = require('http');
let express = require('express');

let app = express();

let server = http.createServer(app);
let io = new Server(server, {
  cors: {
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST'],
  },
});

let onlineUsers = {};
let resiverIdOnline = (resiverId) => onlineUsers[resiverId];
io.on('connection', (socket) => {
  let user = socket.handshake.query.userId;
  socket.join(user.toString());
  if (user) {
    onlineUsers[user] = socket.id;
  }

  io.emit('online', Object.keys(onlineUsers));
  socket.on('disconnect', () => {
    if (user) {
      delete onlineUsers[user];
    }
    io.emit('online', Object.keys(onlineUsers));
  });
});

module.exports = {
  app,
  server,
  io,
  resiverIdOnline,
};
