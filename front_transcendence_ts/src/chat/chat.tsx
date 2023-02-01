import React, { useEffect, useState } from "react";
import "./Chat.css";
import io, {Socket} from "socket.io-client";
import { useNavigate } from 'react-router-dom';
import instance from "../confs/axios_information";

interface Message {
  user: string;
  message: string;
}

const Chat = (props : {id: string | undefined}) => {
    const [message, setMessage] = useState("");
    const [chatRoom, setChatRoom] = useState("General");
    const [messages, setMessages] = useState<Message[]>([]);
    const [socket, setSocket] = useState<Socket>();
    const navigate = useNavigate();
    const [username, setUsername] = useState("");

    async function checkToken() {
        const token = localStorage.getItem('token');
        console.log(token);
        if (!token) {
          navigate('../login');
        } else {
          LoadUserInformation(token);
        }
      }
    
      async function fetchData(token: string) {
        const response = await instance.get('userdata', {
            headers: {
              Authorization: `Bearer ${token}`
            }});
        return response.data;
      }
    
      const LoadUserInformation = (token: string) => {
            fetchData(token)
            .then(data => {
                console.log(data);
                setUsername(data.name);
            })
            .catch(error => {
                console.error(error);
            });
        }
      useEffect(() => {
        checkToken();
      }, []);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = {user: username, message: message};
    console.log(data);
    SendMessage(data);
    setMessage("");
  };

  const SendMessage = (data : Message) => {
    socket?.emit("message", data);
    }

  const messageListener = (data: Message) => {
    setMessages([...messages, {user: data.user, message: data.message}]);
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
            <b>{message.user}:</b> {message.message}
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