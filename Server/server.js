const express = require("express");
const http = require("http");
const socketIo = require("socket.io");

const port = process.env.PORT || 4001;
const index = require("./routes/index");

const app = express();



app.use(index);

const server = http.createServer(app);

const io = socketIo(server);

let host = '';

let users = [];

io.on("connection", (socket) => {
  console.log("New client connected");

  socket.send('Testing message');

  let gameId = ''; 

  socket.on('message', data => {
    console.log(data);
    if(data === 'timer_start' || data === 'timer_stop' || data === 'timer_reset') {
      if(gameId !== '') {
        console.log('came here');
        io.to(gameId).send(data);
      }
    }
  });

  socket.on('request_gameId', () => {
    gameId = '12345';
    socket.emit('new_gameId', gameId);
    host = socket.id;
    console.log("new client: ", socket.id);
  })
  
  socket.on('join_room', data => {
      if (socket.id != host)
        users.push(socket.id);

      socket.join(data);
      console.log("joined_room: " + socket.id + " room id: " + data);
  });

  
  
  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });
});

server.listen(port, () => console.log(`Listening on port ${port}`));