import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';

const socket = io('http://localhost:8001');

const TestChat: React.FC = () => {
  const [ messages, setMessages ] = useState<string[]>([]);

  const messageListener = (data: { user: string, message: string }) => {
    setMessages(prevMessages => [...prevMessages, `${data.user}: ${data.message}`]);
  }

  useEffect(() => {
    socket.emit('join-room', { name: 'Test User', room_id: 'test-room' });

    socket.on("message", messageListener);
    return () => {
      socket.off("message", messageListener);
    }
  }, [messageListener]);

  const handleSendMessage = () => {
    socket.emit('message', { user: 'Test User', message: 'Test Message', roomid: 'test-room' });
  }

  return (
    <div>
      <h1>Test Chat</h1>
      <ul>
        { messages.map((message, index) => <li key={index}>{message}</li>) }
      </ul>
      <button onClick={handleSendMessage}>Send Message</button>
    </div>
  );
}

export default TestChat;