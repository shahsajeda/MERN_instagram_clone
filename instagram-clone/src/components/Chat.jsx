import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';

const socket = io('http://localhost:5000');

function Chat() {
  const [message, setMessage] = useState('');
  const [chat, setChat] = useState([]);
  const [room, setRoom] = useState('');
  const [popup, setPopup] = useState('');
  const [username, setUsername] = useState('');

  const showPopup = (text) => {
    setPopup(text);
    setTimeout(() => setPopup(''), 2000);
  };

  const joinRoom = () => {
    if (room !== '') {
      socket.emit('join_room', room);
      showPopup(`Joined Room: ${room}`);
    }
  };

  const sendMessage = () => {
    if (message.trim() === '') return;
    const msgData = {
      room,
      message,
      time: new Date().toLocaleTimeString(),
      username,
    };
    socket.emit('send_message', msgData);
    setChat((prev) => [...prev, msgData]);
    setMessage('');
    showPopup('Message Sent');
  };

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      const parsedUser = JSON.parse(userData);
      setUsername(parsedUser.username);
    }

    socket.on("receive_message", (data) => {
      setChat((prev) => [...prev, data]);
    });

    socket.on("room_history", (history) => {
      setChat(history);
    });

    socket.on("room_full", (message) => {
      showPopup(message);
    });

    return () => {
      socket.off("receive_message");
      socket.off("room_history");
      socket.off("room_full");
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-900 to-purple-900 text-white px-4 py-6 flex flex-col items-center">
      <h2 className="text-3xl md:text-4xl font-extrabold mb-6 text-center">💬 Chat Room</h2>

      {/* Room Join Section */}
      <div className="mb-4 w-full max-w-lg flex flex-col sm:flex-row gap-3 items-center">
        <input
          className="px-4 py-2 rounded-lg text-black w-full sm:w-auto flex-1"
          placeholder="Enter Room ID"
          value={room}
          onChange={(e) => setRoom(e.target.value)}
        />
        <button
          className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-lg w-full sm:w-auto"
          onClick={joinRoom}
        >
          Join Room
        </button>
      </div>

      {/* Message Input */}
      <div className="mb-4 w-full max-w-lg flex flex-col sm:flex-row gap-3 items-center">
        <input
          className="px-4 py-2 rounded-lg text-black w-full flex-1"
          placeholder="Type a message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <button
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg w-full sm:w-auto"
          onClick={sendMessage}
        >
          Send
        </button>
      </div>

      {/* Chat Box */}
      <div className="w-full max-w-lg bg-white text-black rounded-lg p-4 shadow-lg h-72 overflow-y-auto">
        {chat.length === 0 ? (
          <p className="text-center text-gray-600 italic">No messages yet</p>
        ) : (
          chat.map((msg, index) => (
            <div
              key={index}
              className={`mb-3 p-2 rounded-lg ${
                msg.username === username
                  ? 'bg-blue-100 text-right'
                  : 'bg-green-100 text-left'
              }`}
            >
              <p className="text-sm font-semibold">
                {msg.username === username ? 'You' : msg.username}
              </p>
              <p className="text-base break-words">{msg.message}</p>
              <p className="text-xs text-gray-500 mt-1">{msg.time}</p>
            </div>
          ))
        )}
      </div>

      {/* Popup Message */}
      {popup && (
        <div className="fixed bottom-5 right-5 bg-black/80 text-white px-6 py-3 rounded-lg shadow-lg animate-bounce z-50">
          {popup}
        </div>
      )}
    </div>
  );
}

export default Chat;
