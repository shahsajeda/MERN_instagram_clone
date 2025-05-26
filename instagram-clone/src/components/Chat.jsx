// import React, { useEffect, useState } from 'react';
// import io from 'socket.io-client';

// const socket = io('http://localhost:5000'); // backend server

// function Chat() {
//   const [message, setMessage] = useState('');
//   const [chat, setChat] = useState([]);
//   const [room, setRoom] = useState('');

//   const joinRoom = () => {
//     if (room !== '') {
//       socket.emit('join_room', room);
//     }
//   };


//   const sendMessage = () => {
//     const msgData = {
//       room,
//       message,
//       time: new Date().toLocaleTimeString()
//     };
//     socket.emit('send_message', msgData);
//     setChat([...chat, msgData]);
//     setMessage('');
//   };

//   useEffect(() => {
//     socket.on('receive_message', (data) => {
//       setChat((prev) => [...prev, data]);
//     });

//     // Cleanup socket listener
//     return () => {
//       socket.off('receive_message');
//     };
//   }, []);

//   return (
//     <div style={{ paddingLeft: '20rem',paddingTop:'5rem'
//     }}>
//       <h2>Chat Room</h2>
//       <input
//         placeholder="Room ID"
//         value={room}
//         onChange={(e) => setRoom(e.target.value)}
//       />
//       <button onClick={joinRoom}>Join Room</button>
//       <br /><br />
//       <input
//         placeholder="Type message"
//         value={message}
//         onChange={(e) => setMessage(e.target.value)}
//       />
//       <button onClick={sendMessage}>Send</button>

//       <div style={{ marginTop: '1rem' }}>
//         {chat.map((msg, index) => (
//           <p key={index}>
//             <strong>{msg.time}</strong>: {msg.message}
//           </p>
//         ))}
//       </div>
//     </div>
//   );
// }

// export default Chat;
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
    setTimeout(() => setPopup(''), 2000); // auto close after 2 sec
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
    setChat([...chat, msgData]);
    setMessage('');
    showPopup('Message Sent');
  };

//   useEffect(() => {
//     socket.on('receive_message', (data) => {
//       setChat((prev) => [...prev, data]);
//     });
//     return () => socket.off('receive_message');
//   }, []);
// useEffect(() => {
//   socket.on("receive_message", (data) => {
//     setChat((prev) => [...prev, data]);
//   });

//   socket.on("room_history", (history) => {
//     setChat(history); // 👈 Load past messages
//   });

//   return () => {
//     socket.off("receive_message");
//     socket.off("room_history");
//   };
// }, []);
useEffect(() => {
  const userData = localStorage.getItem("user");
  if (userData) {
    const parsedUser = JSON.parse(userData);
    setUsername(parsedUser.username);  // Set the username automatically
  }

  socket.on("receive_message", (data) => {
    setChat((prev) => [...prev, data]);
  });

  socket.on("room_history", (history) => {
    setChat(history); // Load chat history for room
  });

  return () => {
    socket.off("receive_message");
    socket.off("room_history");
  };
}, []);



  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-900 to-purple-900 text-white flex flex-col items-center justify-start pt-20 px-6">
      <h2 className="text-3xl font-bold mb-6">💬 Chat Room</h2>


      <div className="mb-4 flex gap-2">
        <input
          className="px-4 py-2 rounded-lg text-black"
          placeholder="Enter Room ID"
          value={room}
          onChange={(e) => setRoom(e.target.value)}
        />
        <button
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition duration-200"
          onClick={joinRoom}
        >
          Join Room
        </button>
      </div>

      <div className="mb-4 flex gap-2">
        <input
          className="px-4 py-2 rounded-lg text-black w-64"
          placeholder="Type a message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <button
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition duration-200"
          onClick={sendMessage}
        >
          Send
        </button>
      </div>

      <div className="ml-11 w-full max-w-xl bg-white rounded-lg text-black p-4 mt-4 h-64 overflow-y-auto shadow-md">
        {chat.map((msg, index) => (
          <p key={index} className="mb-2">
  <span className="font-semibold text-green-500">{msg.username}</span>{' '}
  <span className="text-blue-600">[{msg.time}]</span>: {msg.message}
</p>

        ))}
      </div>

      {popup && (
        <div className="fixed bottom-5 right-5 bg-black bg-opacity-80 text-white px-6 py-3 rounded-lg shadow-lg transition duration-300 animate-bounce">
          {popup}
        </div>
      )}
    </div>
  );
}

export default Chat;
