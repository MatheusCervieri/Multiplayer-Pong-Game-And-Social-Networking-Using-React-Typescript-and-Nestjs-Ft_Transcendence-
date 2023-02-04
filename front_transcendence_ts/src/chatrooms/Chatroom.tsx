import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import { useFetcher, useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import GetToken from '../utils/GetToken';
import  instance from '../confs/axios_information';

const socket = io('http://localhost:8001');

const Chatroom: React.FC = () => {
const [ messages, setMessages ] = useState<string[]>([]);
const { id } = useParams<{ id: string | undefined }>();
const [ message, setMessage ] = useState<string>('Test Message');
const [username, setUsername] = useState<string>('');
const [data, setData] = useState<any>();
const [renderPage, SetRenderPage] = useState<boolean>(false);
const navigate = useNavigate();


const messageListener = (data: { user: string, message: string }) => {
  setMessages(prevMessages => [...prevMessages, data.message]);
}

async function fetchRoomData() {
  const response = await instance.get('chatdata/get-room/' + id);
  if (response.status >= 200 && response.status < 300) {
    console.log("Chegu no fetch room data!");
  return response.data;
  } 
  else {
    alert("This room does not exist!");
    navigate('/chat');
  }
}

  async function fetchMessageData() {
    const response = await instance.get('/chatdata/get-room-messages/' + id);
    if (response.status >= 200 && response.status < 300) {
    return response.data;
    } 
    else {
      console.log("Error!");
      return [];
    }
  }
  function extractMessages(objects: Array<any>) {
    return objects.map(object => object.message);
  }

function LoadMessages()
{
  const datamessages = fetchMessageData();
  datamessages.then((data) => {
    console.log(datamessages);
    setMessages(extractMessages(data));
  });

}

function StartRoom()
{
  SetRenderPage(true);
  LoadMessages();
}

const InitializeRoom = () => {
  fetchRoomData().then(roomdata => {
    setData(roomdata);
    console.log(data);
    if (data.type === 'public')
    {
      console.log("Public 1");
      StartRoom();
    }
    if (data.type === 'protected')
    {
      const enteredPassword = prompt("Please enter the password for this room:");
      if (enteredPassword == data.password)
      {
        StartRoom();
      }
      else {
        alert("Incorrect password! You will be redirected to the chat page.");
        navigate('/chat');
      }
    }
    if (data.type === 'private')
    {
      StartRoom();
    }
  });
 


}

useEffect(() => {
  GetToken(navigate, setUsername);
  console.log("It will initiadlize  room!1");
  InitializeRoom();
}, []);

useEffect(() => {
  if (renderPage == true)
  {
    handleRoom();
  }
}, [renderPage, socket]);

useEffect(() => {
socket.on("message", messageListener);
return () => {
  socket.off("message", messageListener);
}
}, [messageListener, id]);

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
{ messages.map((m, index) => <li key={index}>{username} : {m}</li>) }
</ul>
<button onClick={handleSendMessage}>Send Message</button>
</div>
);
}

export default Chatroom;