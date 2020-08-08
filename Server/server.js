const express = require("express");
const http = require("http");
const socketIo = require("socket.io");

const port = process.env.PORT || 4001;
const index = require("./routes/index");

const app = express();



app.use(index);

const server = http.createServer(app);

const io = socketIo(server);

let games = [];
let players = {};

io.on("connection", (socket) => {
  console.log("New client connected");

  socket.send('Testing message');

  let gameId = ''; 
  let pName = '';

  socket.on('message', data => {
    console.log(data);
    if(data === 'timer_start' || data === 'timer_stop' || data === 'timer_reset') {
      if(gameId !== '') {
        console.log('came here');
        socket.to(gameId).send(data);
      }
    }
  });

  socket.on('request_gameId', () => {
    gameId = '12345';
    socket.emit('new_gameId', gameId);
    host = socket.id;
    console.log("new client: ", socket.id);

    socket.join(gameId);

    games.push({gameId: gameId, host: host, pNames: new Set(), nPlayers: 0});

    console.log(games);
  })

  
  socket.on('join_room', data => {
    let flag = 0;
    games.forEach(element => {
      if (element.gameId === data.gameId) {
        flag = 1;
        if (!element.pNames.has(data.pName)) {
          ++element.nPlayers;
          element.pNames.add(data.pName);

          socket.join(data.gameId);
          console.log("name: " + data.pName + " socket id: " + socket.id);                                      
          gameId = data.gameId;
          pName = data.pName;

          console.log(games);
          socket.emit('join_room_response', 'Successful');
          players[pName] = socket.id;

          io.to(element.host).emit('new_player', pName);
        }
        else {
          socket.emit('join_room_response','pName_repeat');
        }
      }
    });

    console.log(players);
    
    if(flag === 0)
      socket.emit('join_room_response','gameId doesn\'t exist');
  });

  socket.on("player_delete", (pName) => {
    let player_id = players[pName];
    console.log('player_id: ' + player_id + ' pName: ' + pName);
    // let players_room = io.sockets.adapter.rooms[gameId].sockets;
    // console.log(players_room);

    io.sockets.connected[player_id].disconnect(true);
    console.log("hopefully");
    
    console.log(players);
    socket.emit('player_disconnected', pName);
  });

  
  
  socket.on("disconnect", () => {
    console.log("Client disconnected");

    games.forEach(element => {
      if (element.gameId === gameId) {
        if (socket.id !== element.host) {
          --element.nPlayers;
          element.pNames.delete(pName);
        }
        else if (socket.id == element.host) {
          element.host = undefined;
        }

        if(element.host === undefined) {
          games.splice(games.indexOf(element), 1);
        }

        delete players[pName];
        console.log(players);

        socket.emit('player_disconnected', pName);
      }
    });

    console.log(games);

  });
});

server.listen(port, () => console.log(`Listening on port ${port}`));