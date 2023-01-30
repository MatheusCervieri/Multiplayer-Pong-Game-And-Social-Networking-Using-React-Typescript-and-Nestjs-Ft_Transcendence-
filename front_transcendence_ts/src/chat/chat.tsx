import React, { useState } from "react";
import "./Chat.css";

interface Message {
  author: string;
  text: string;
}

const Chat: React.FC = () => {
  const [message, setMessage] = useState("");
  const [chatRoom, setChatRoom] = useState("General");
  const [messages, setMessages] = useState<Message[]>([]);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setMessages([...messages, { author: "User", text: message }]);
    setMessage("");
  };

  return (
    <div className="chat-container">
      <h3 className="chat-room">Chat Room: {chatRoom}</h3>
      <ul className="messages-list">
        {messages.map((message, index) => (
          <li className="message" key={index}>
            <b>{message.author}:</b> {message.text}
          </li>
        ))}
      </ul>
      <form className="message-form" onSubmit={handleSubmit}>
        <input
          className="message-input"
          type="text"
          value={message}
          onChange={(event) => setMessage(event.target.value)}
        />
        
        <button className="send-button1" type="submit">
          Send
    
        </button>
      </form>
    </div>
  );
};

export default Chat;