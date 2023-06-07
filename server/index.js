const path = require('path');
const db = require('../database/index.js')
const postPlayer = require('../database/controllers.js')
const io = require('socket.io')(3000, {
  cors: {
    origin: ["http://localhost:8080",
    "http://localhost:3000"
  ],
  }
  });

  const players = {};

  io.on('connection', socket => {
    //on connection send all of the players to the new socket
    socket.emit('getting-all-players', players)
    //upon recieving a moved character send that moved character to each client
    //and store store the new characters position in the db
    socket.on('send-player-to-db', player => {
      // console.log('player', player)
      postPlayer(player);
    })

    socket.on('send-player-to-server', player => {
      // console.log(player)
      players[player.id] = player
      io.emit('send-player-to-clients', player)
    })
    socket.on('send-message-to-server', message => {
      io.emit('send-message-to-clients', {message:message.message,id:socket.id, usrName:message.usrName})
      setTimeout(() => {
        io.emit('send-message-to-clients', {message:'',id:socket.id})
      }, 8000)
    })
    //upon disconnecting tell all the clients which element to remove from the dom
    socket.on('disconnect', () => {
      io.emit('delete-player', socket.id)
      delete players[socket.id]
    } )
  })


  const express = require('express');
  const morgan = require('morgan');


  const app = express();
  app.use(morgan('dev'));


  app.use(express.urlencoded({ extended: true }));
  app.use(express.json());


  app.use(express.static(path.join(__dirname, '../client/dist')));

  app.get('/', (req, res) => {
    // res.send('Hello World!')
  });

  const PORT = process.env.PORT || 8080;
  app.listen(PORT, () => {
    console.log(`Server available at http://localhost${PORT}`);
  });
