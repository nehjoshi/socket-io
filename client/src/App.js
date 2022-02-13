import React from 'react';
import "./App.css";
import io from 'socket.io-client';
import Chat from './Chat';

const socket = io.connect("https://nj-socket-chat.herokuapp.com/");

export default function App() {

  const [name, setName] = React.useState("");
  const [id, setId] = React.useState("");
  const [showChat, setShowChat] = React.useState(false);

  const JoinRoom = () => {
    if (name !== "" && id !== "") {
      socket.emit("join_room", id);
      setShowChat(true);
    }
  }

  return (
    <div className="wrapper">
      {!showChat ?
        <div className="joinChatContainer">
          <h3>Join a chat!</h3>
          <input type="text" placeholder="Your name here..." onChange={e => setName(e.target.value)} />
          <input type="text" placeholder="Room ID here..." onChange={e => setId(e.target.value)} />
          <button onClick={JoinRoom}>Join a room</button>
        </div>
        :
        <Chat socket={socket} name={name} id={id} />
      }
    </div>
  )
}