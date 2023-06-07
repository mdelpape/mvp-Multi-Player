import React, { useState, useEffect } from 'react';
import ghost from '../Assets/ghost.gif';
import wizard from '../Assets/wizard.png';
import paladin from '../Assets/paladin.png';
import healer from '../Assets/healer.png'
import archer from '../Assets/archer.png'
import knight from '../Assets/knight.png'

export default function Players({ usr, message}) {
  // console.log(message)
  return (
    <div
      key = {usr.socketId}
      className={usr.className}
      id={usr.socketId}
      style={{ position: 'absolute', top: usr.position.y, left: usr.position.x }}
    >
      <p className={`message ${usr.socketId}`} style={(message !== '') ? {border: '1px solid black', borderRadius: '5px', backgroundColor: 'rgb(240, 248, 255, 0.5)'} : null} key ={usr.socketId}>
  {message || ''}
</p>

      {usr.className === 'player wizard' && <img id='wiz' src={wizard} />}
      {usr.className === 'player paladin' && <img id='pal' src={paladin} />}
      {usr.className === 'player healer' && <img id='heal' src={healer} />}
      {usr.className === 'player ghost' && <img id='ghost' src={ghost} />}
      {usr.className === 'player knight' && <img id='knight' src={knight} />}
      {usr.className === 'player archer' && <img id='archer' src={archer} />}
      <p style={{ margin: '0px', whiteSpace: 'nowrap' }}>{usr.user}</p>
    </div>
  )
}