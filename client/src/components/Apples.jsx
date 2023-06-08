import React, { useState, useEffect } from 'react';

export default function Apple({x, y}) {

  return (
    <div style = {{top: y + 'px', left: x + 'px', position: 'absolute'}}>Apple</div>
  )
}