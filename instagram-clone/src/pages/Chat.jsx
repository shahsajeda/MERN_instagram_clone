import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';

const socket = io('http://localhost:5000'); // backend server

function Chat() {
  const [message, setMessage] = useState('');
  const [chat, setChat] = useState([]);
  const [room, setRoom] = useState('');

  const joinRoom = () => {
    if (room !== '') {
      socket.emit('join_room', room);
    }
  };

  const sendMessage = () => {
    const msgData = {
      room,
      message,
      time: new Date().toLocaleTimeString()
    };
    socket.emit('send_message', msgData);
    setChat([...chat, msgData]);
    setMessage('');
  };

  useEffect(() => {
    socket.on('receive_message', (data) => {
      setChat((prev) => [...prev, data]);
    });

    // Cleanup socket listener
    return () => {
      socket.off('receive_message');
    };
  }, []);

  return (
    <div style={{ padding: '1rem' }}>
      <h2>Chat Room</h2>
      <input
        placeholder="Room ID"
        value={room}
        onChange={(e) => setRoom(e.target.value)}
      />
      <button onClick={joinRoom}>Join Room</button>
      <br /><br />
      <input
        placeholder="Type message"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />
      <button onClick={sendMessage}>Send</button>

      <div style={{ marginTop: '1rem' }}>
        {chat.map((msg, index) => (
          <p key={index}>
            <strong>{msg.time}</strong>: {msg.message}
          </p>
        ))}
      </div>
    </div>
  );
}

export default Chat;
