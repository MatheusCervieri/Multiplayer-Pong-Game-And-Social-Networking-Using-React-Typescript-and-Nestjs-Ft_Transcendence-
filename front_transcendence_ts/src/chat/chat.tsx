import React, { useEffect, useState } from "react";
import "./Chat.css";
import io, {Socket} from "socket.io-client";

interface Message {
  author: string;
  text: string;
}

const Chat = (props : {id: string | undefined}) => {
    const [message, setMessage] = useState("");
    const [chatRoom, setChatRoom] = useState("General");
    const [messages, setMessages] = useState<Message[]>([]);
    const [socket, setSocket] = useState<Socket>();

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    SendMessage(message);
    setMessage("");
  };

  const SendMessage = (value: string) => {
    socket?.emit("message", value);
    }

  const messageListener = (message:string) => {
    setMessages([...messages, {author: "User", text: message}]);
}

  useEffect(() => {
    const new_socket = io("http://localhost:8001");
    setSocket(new_socket);
   
  }, [setSocket]);

  useEffect(()=> {
    socket?.on("message", messageListener);
    return () => {
      socket?.off("message", messageListener);
    }
  }, [messageListener]);

  return (
    <div className="chat-container">
      <h3 className="chat-room">Chat Room: {props.id}</h3>
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