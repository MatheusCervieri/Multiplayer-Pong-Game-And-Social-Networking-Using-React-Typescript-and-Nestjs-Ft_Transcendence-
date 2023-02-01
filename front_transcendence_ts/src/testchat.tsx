import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';

const socket = io('http://localhost:8001');

const TestChat: React.FC = () => {
const [ messages, setMessages ] = useState<string[]>([]);
const [ room, setRoom ] = useState<string>('test-room');
const [ message, setMessage ] = useState<string>('Test Message');

const messageListener = (data: { user: string, message: string }) => {
setMessages(prevMessages => [...prevMessages, data.message]);
}

useEffect(() => {
socket.on("message", messageListener);
return () => {
  socket.off("message", messageListener);
}
}, [messageListener, room]);

const handleSendMessage = () => {
socket.emit('message', { user: 'Test User', message: message, roomid: room });
}

function handleRoom(){
  socket.emit('join-room', { name: 'Test User', room_id: room });
}

return (
<div>
<h1>Test Chat</h1>
<div>
<label htmlFor="room">Room:</label>
<input type="text" id="room" value={room} onChange={(e) => setRoom(e.target.value)} />
</div>
<div>
<label htmlFor="message">Message:</label>
<input type="text" id="message" value={message} onChange={(e) => setMessage(e.target.value)} />
</div>
<ul>
{ messages.map((m, index) => <li key={index}>{m}</li>) }
</ul>

<button onClick={handleSendMessage}>Send Message</button>
<button onClick={handleRoom}> Choose Room</button>
</div>
);
}

export default TestChat;