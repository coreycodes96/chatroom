import {useState, useEffect} from 'react';
import io from 'socket.io-client';
import './App.css';

let socket;

const CONNECTION_PORT = 'localhost:3000/';


const App = () => {
  const [login, setLogin] = useState(false);
  const [username, setUsername] = useState("");
  const [room, setRoom] = useState("");

  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

  const connectToRoom = () => {
    setLogin(true);
    setMessage("");
    socket.emit('join_room', room);
  }

  useEffect(() => {
    const messages_container = document.querySelector('.messages-container');

    if(messages_container != null){
      window.setInterval(() => {
        messages_container.scrollTop = messages_container.scrollHeight;
      }, 0);
    }

    return () => {
      window.clearInterval();
    }
  })

  useEffect(() => {
    socket = io(CONNECTION_PORT);
  }, [CONNECTION_PORT])

  useEffect(() => {
    socket.on('receive_message', (data) => {
      setMessages([...messages, {'username': data.username, 'message': data.message}]);
    })
  })

  const sendMessage = () => {
    const data = {
      username,
      room,
      message
    };

    socket.emit('send_message', data);
    setMessages([...messages, {'username': data.username, 'message': data.message}]);

    setMessage("");
  }
  
  return (
    <div className="App">
      <h1>Learning SocketIO</h1>
      {!login ? 
        <>
          <div className="login-container">
            <div className="login-input">
              <input type="text" onChange={e => setUsername(e.target.value)} value={username} placeholder="Enter username"/>
            </div>
            <div className="login-input">
              <input type="text" onChange={e => setRoom(e.target.value)} value={room} placeholder="Enter a room name"/>
            </div>
            <button onClick={connectToRoom}>Enter Chat</button>
          </div>
        </> :
        <>
          <div className="messages-container">
            <div className="messages">
              {messages.map((message, index) => {
                return (
                  <div key={index} style={{display: 'flow-root'}}>
                    <div id={message.username === username ? 'you' : 'other'}>{message.username}: {message.message}</div>
                  </div>
                )
              })}
            </div>
            <div className="send-message-container">
              <input type="text" onChange={e => setMessage(e.target.value)} value={message} placeholder="Enter a message"/>
              <button onClick={sendMessage}>Send Message</button>
            </div>
          </div>
        </>
      }
    </div>
  );
}

export default App;