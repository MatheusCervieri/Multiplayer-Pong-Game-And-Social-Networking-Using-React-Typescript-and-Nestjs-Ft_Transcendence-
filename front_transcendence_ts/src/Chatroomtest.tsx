import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import { useFetcher, useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

const socket = io('http://localhost:8001');

//A gente precisa criar um objeto que vai armazenar o:
//nome do usuário, a sala que ele está. 

const Chatroomtest: React.FC = () => {
const [ messages, setMessages ] = useState<string[]>([]);
const [ message, setMessage ] = useState<string>('Test Message');
const [username, setUsername] = useState<string>('');
const id = 'room10'
const navigate = useNavigate();

const messageListener = (data: { user: string, message: string }) => {
  setMessages(prevMessages => [...prevMessages, data.message]);
}

useEffect(() => {
      setUsername("Matheus");
}, []);

useEffect(() => {
  handleRoom();
}, [socket]);

useEffect(() => {
socket.on("message", messageListener);
console.log("Oi");
return () => {
  socket.off("message", messageListener);
}
}, [messageListener]);

const handleSendMessage = () => {
socket.emit('message', { user: username, message: message, roomid: id });
}

function handleRoom(){
  socket.emit('join-room', { name: username, room_id: id });
}

return (
<div>
<h1>Chat Room {id}</h1>
<div>
<label htmlFor="message">Message:</label>
<input type="text" id="message" value={message} onChange={(e) => setMessage(e.target.value)} />
</div>
<ul>
{ messages.map((m, index) => <li key={index}>{m}</li>) }
</ul>
<button onClick={handleSendMessage}>Send Message</button>
</div>
);
}

export default Chatroomtest;