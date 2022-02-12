import React from 'react';
import io from 'socket.io-client';

const socket = io.connect("http://localhost:5000");

export default function App(){
  return (
    <h1>Hello world!</h1>
  )
}