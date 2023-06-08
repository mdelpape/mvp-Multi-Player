import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import Players from './Players.jsx';
import fire from '../Assets/fire.png';
import blimp from '../Assets/blimp.png';
import shadow from '../Assets/shadow.png';
import statue1 from '../Assets/statue1.png';
import statue2 from '../Assets/statue2.png';
import statue3 from '../Assets/statue3.png';
import statue4 from '../Assets/statue4.png';
import pyramid from '../Assets/pyramid.png';
import airplane from '../Assets/airplane.png'
// import Apple from './Apples.jsx';

import { io } from 'socket.io-client';

const socket = io('http://localhost:3000')
socket.on('connect', () => {
  console.log(`connected on ${socket.id}`)
})

export default function Start() {
  const [players, setPlayers] = useState([]);
  const [myChar, setMyChar] = useState(null);
  const [modalState, setModalState] = useState(true);
  const [keyPresses, setKeyPresses] = useState({});
  const [messages, setMessages] = useState({});
  const [msgsArray, setMsgsArray] = useState([]);
  // const [appleCords, setAppleCords] = useState({x:0, y:0})
  // const [appleFound, setAppleFound] = useState(false)

  // if (myChar) {
  //   let newX = myChar.position.x;
  //   let newY = myChar.position.y;
  //   let aX = appleCords.x;
  //   let aY = appleCords.y
  //   // console.log(newX)
  //   // console.log('new', newX,'apple',  aX)
  //   // console.log('new', newY,'apple',  aY)
  //   if (newX > (aX-50) && newX < (aX+50) && newY > (aY-50) && newX < (aY)) {
  //     setAppleFound(!appleFound);
  //   }

  // }

  // useEffect(() => {
  //   console.log('apple cords set')
  //   var x = Math.floor(Math.random() * 3000);
  //   var y = Math.floor(Math.random() * 3000);
  //   setAppleCords({x:x, y:y})
  //   console.log(x, y)
  // },[appleFound])

  useEffect(() => {
    if (myChar) {
      socket.emit('send-player-to-server', myChar);
    }
  }, [myChar])

  useEffect(() => {
    socket.on('delete-player', socketId => {
      // console.log('deleted')
      setPlayers(players => players.filter(player => player.id !== socketId));
    })

    socket.on('getting-all-players', playersObj => {
      setPlayers(Object.values(playersObj))
    })
    socket.on('send-player-to-clients', player => {
      // console.log('sent Player to client')
      setPlayers(prevPlayers => {
        const playerExists = prevPlayers.some(p => p.socketId === player.socketId);

        // If the player already exists, update their information
        if (playerExists) {
          return prevPlayers.map(p => p.socketId === player.socketId ? player : p);
        }

        // If the player doesn't exist, add them to the array
        else {
          return [...prevPlayers, player];
        }
      });
    });

  }, [])

  const submitHandler = (e) => {
    e.preventDefault();
    var charClass = document.getElementById('myClass').value;

    var user = e.target.querySelector('#username').value
    if (user === '') {
      alert("Provide Username");
    } else if (user.length > 20) {
      alert("Username Must Be Less Than 20 Characters")
    } else {
      const newChar = {
        user: user,
        id: socket.id,
        className: `player ${charClass}`,
        position: { x: 0, y: 0 },
        socketId: socket.id,
        message: '',
      }
      socket.emit('send-player-to-db', newChar);
      setMyChar(newChar);
      setPlayers(prevPlayers => [...prevPlayers, newChar]);
      setModalState(!modalState)
    }
  }

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (document.activeElement.id !== 'chatInput') {
        setKeyPresses((prev) => ({ ...prev, [event.key]: true }));
      }
    };

    const handleKeyUp = (event) => {
      if (document.activeElement.id !== 'chatInput') {
        setKeyPresses((prev) => ({ ...prev, [event.key]: false }));
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    const gameLoop = () => {
      if (!myChar) {
        return;
      }

      const viewWidth = window.innerWidth;
      const viewHeight = window.innerHeight;
      const root = document.getElementById('root');
      const MOVEMENT_SPEED = 20;
      let newX = myChar.position.x;
      let newY = myChar.position.y;
      // console.log(newX)
      // console.log('new', newX,'apple',  aX)
      // console.log('new', newY,'apple',  aY)
      // if (newX > (aX-50) && newX < (aX+50) && newY > (aY-50) && newX < (aY)) {
      //   setAppleFound(!appleFound);
      // }

      if (keyPresses.w) {
        if (newY > 0) {
          if (myChar.position.y <= (3000 - viewHeight / 2)) {
            root.scrollTop -= MOVEMENT_SPEED
          }
          newY -= MOVEMENT_SPEED;
        }
      } else if (keyPresses.s) {
        // console.log(newY)
        if (newY < 2950) {
          if (myChar.position.y >= (viewHeight / 2 - 100)) {
            root.scrollTop += MOVEMENT_SPEED
          }
          newY += MOVEMENT_SPEED;
        }
      }
      if (keyPresses.a) {
        // console.log(myChar.position.x , viewWidth/2)
        if (newX > 0) {
          if (myChar.position.x <= (3000 - viewWidth / 2)) {
            root.scrollLeft -= MOVEMENT_SPEED;
          }
          newX -= MOVEMENT_SPEED;
        }
      } else if (keyPresses.d) {
        // console.log(myChar.position.x , viewWidth/2)
        if (newX < 2940) {
          if (myChar.position.x >= viewWidth / 2) {
            root.scrollLeft += MOVEMENT_SPEED;
          }
          newX += MOVEMENT_SPEED;
        }
      }

      if (newX !== myChar.position.x || newY !== myChar.position.y) {
        setMyChar((prevChar) => ({
          ...prevChar,
          position: { x: newX, y: newY },
        }));
      }
    };

    // Start the animation frame loop
    const intervalId = setInterval(gameLoop, 1000 / 45); // Assuming 60 FPS

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      clearInterval(intervalId);
    };
  }, [myChar, keyPresses]);

  const chatHandler = (e) => {
    e.preventDefault();
    var input = e.target.querySelector('#chatInput');
    socket.emit('send-message-to-server', { message: input.value, usrName: myChar.user });

    input.value = '';
  }

  useEffect(() => {
    const messageHandler = (message) => {
      // console.log(message)
      setMessages((prevMessages) => ({ ...prevMessages, [message.id]: message.message }));
      if (message.message !== '') {
        setMsgsArray((prevMessages) => [...prevMessages, message].slice(-10));
      }
    }

    socket.on('send-message-to-clients', messageHandler);
  }, []);



  return (
    <div id="app">
      <Modal

        isOpen={modalState}
        onRequestClose={() => { setModalState(false) }}
        ariaHideApp={false}
        style={{
          overlay: {
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
          },
          content: {
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#fffced',
            border: 'none',
            borderRadius: '8px',
            padding: '20px',
            maxWidth: '400px',
            margin: '0 auto',
            height: '400px',
          },
        }}
      >
        <h1>Multiplayer Experience</h1>
        <form onSubmit={submitHandler}>
          <label htmlFor="username" className="label">Username:</label>
          <input id='username' className="input"></input>
          <div className="dropdown">
            <select id='myClass' className="select">
              <option value="wizard">Select an option</option>
              <option value="wizard">Wizard</option>
              <option value="knight">Knight</option>
              <option value="healer">Healer</option>
              <option value="paladin">Paladin</option>
              <option value="archer">Archer</option>
              <option value="ghost">Ghost</option>
            </select>
            <button className="button">PLAY</button>
          </div>
        </form>
      </Modal>
      <img src={blimp} style={{ position: 'absolute', left: '1500px', top: '1500px', width: '500px', zIndex: 1 }} />
      <img className='shadow' src={shadow} style={{ position: 'relative', left: '1400px', top: '1600px', width: '275px', opacity: '.5' }} />
      <img src={fire} style={{ position: 'absolute', left: '1500px', top: '2500px', height: '300px' }} />
      <img src={statue4} style={{ position: 'absolute', left: '300px', top: '300px', height: '300px' }} />
      <img src={statue2} style={{ position: 'absolute', left: '2600px', top: '300px', height: '300px' }} />
      <img src={statue3} style={{ position: 'absolute', left: '300px', top: '2500px', height: '300px' }} />
      <img src={statue1} style={{ position: 'absolute', left: '2600px', top: '2500px', height: '300px' }} />
      <img src={pyramid} style={{ position: 'absolute', left: '1200px', top: '400px', height: '500px' }} />
      <div className='airplane'>
        <img src={airplane} style={{ position: 'absolute', zIndex: 1 }} />
        <img className='shadow' src={shadow} style={{ position: 'absolute', top: '150px', opacity: '.5', width: '200px', left: '-50px' }} />
      </div>
      {players.map((player) => {
        return <Players usr={player} message={messages[player.id] || ''} key={player.id} />
      })}
      {/* <div style = {{top:`${appleCords.y}px`, left:`${appleCords.x}px`, position:'absolute'}}>Apple</div> */}
      <b style={{ position: 'absolute', left: '100px', top: '20px', }}>W-A-S-D TO MOVE</b>
      <div className='online'>
        <div>
          <u>Players Online: <b>{players.length}</b></u>
        </div>
        {players.map((player) => (
          <div key={player.id}>
            <b>{player.user}</b>
          </div>
        ))}
      </div>
      <div className='publicChat'>
        {msgsArray.map((message) => (
          <p style={{ margin: '1px 1px' }}>
            <span style={{ fontWeight: 'bold' }}>{message.usrName}:</span> {message.message}
          </p>
        ))}
      </div>
      <div className='footer'>
        <form onSubmit={chatHandler} className='chat font'>
          <input type='text' placeholder='Chat' id='chatInput' className='chatInput' ></input>
          <button className='chatButton'>Enter</button>
        </form>
      </div>
    </div>
  );



};