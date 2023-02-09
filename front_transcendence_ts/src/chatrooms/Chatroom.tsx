import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import { useFetcher, useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import GetToken from '../utils/GetToken';
import  instance from '../confs/axios_information';
import axios from 'axios';
import { serverurl } from '../confs/axios_information';
import Privateroomdiv from './Privateroomdiv';
import UserSearch from '../utils/components/Usersearch';
import GetUserData from '../utils/GetUserData';
import Message from './Message';

const socket = io('http://localhost:8001');

const Chatroom: React.FC = () => {
const [ messages, setMessages ] = useState<{id: number , user: string, message:string}[]>([]);
const { id } = useParams<{ id: string | undefined }>();
const [ message, setMessage ] = useState<string>('Test Message');
const [username, setUsername] = useState<string>('');
const [data, setData] = useState<{id: string, name: string, adm: string | null , type: string | null , password:string | null }>();
const [renderPage, SetRenderPage] = useState<boolean>(false);
const [promptShown, setPromptShown] = useState<boolean>(false);
const [enteredPassowrd, setEnteredPassword] = useState<string>('');
const [blockedUsers , setBlockedUsers] = useState<string[]>([]);
const navigate = useNavigate();


const loadBlockedUsers = async () => {
  const token = localStorage.getItem('token');
  instance.get('/userdata/blocked-users', {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  })
    .then(response => {
      const blockednames = response.data.map((obj: { name: string; }) => (obj.name));
      setBlockedUsers(blockednames);
    })
    .catch(error => {
      console.error(error);
    });
};


const messageListener = (data: { user: string, message: string }) => {
  const datamessage = { id: 1, user: data.user, message: data.message };
  setMessages(prevMessages => [...prevMessages, datamessage]);
}

async function start()
{
  const userdata = await GetUserData(navigate);
  setUsername(userdata.name);
  axios.get(serverurl + '/chatdata/get-room/' + id)
          .then(response => {
            // handle success
            if(response.data.status === 404)
            {
              navigate('/404');
            }
            else 
            {
            console.log(response.data.room);
            setData(response.data.room);
            InitializeRoom(response.data.room, userdata.name);
            }
          })
          .catch(error => {
            // handle error
            console.log(error);
    });
}

useEffect(() => {
  start();
}, [id, navigate]);

function LoadMessages()
{
  axios.get(serverurl + '/chatdata/get-room-messages/' + id)
    .then(response => {
      // handle success
      console.log(response.data);
      setMessages(response.data);
      })
    .catch(error => {
      // handle error
      console.log(error);
      return null;
    });
}

function StartRoom()
{
  loadBlockedUsers();
  SetRenderPage(true);
  LoadMessages();
}

function handlePassword()
{
  if (!data)
  {
    return;
  }

  if (enteredPassowrd === data.password)
  {
    StartRoom();
  }
  else
  {
    alert("Wrong password!");
  }
}

function isStringInArray(string: string | undefined, arrayOfStrings: string[]) {
  if(string)
  {
    console.log("Chegou aqui");
    console.log(string);
    return arrayOfStrings.includes(string);
    
  }
  }

const InitializeRoom = (data: any, user_name? : string) => {
  console.log(data.type);
    if (data.type === 'public')
    {
      StartRoom();
    }
    if (data.type === 'protected')
    {
      setPromptShown(true);
    }
    if (data.type === 'private')
    {
      console.log("PRIVATEEEE");
      
      //Check if the user is in the room
    axios.get(serverurl + '/chatdata/room-users/' + id)
    .then(response => {
      // handle success
      console.log("Username:", user_name, "Reponse:" , response.data);
      if(isStringInArray(user_name, response.data) == true)
      {
        StartRoom();
      }
      else
      {
        navigate('/chat');
      }
      })
    .catch(error => {
      // handle error
      console.log(error);
      navigate('/chat');
    });
    }
    if (data.type == 'dm')
    {
      axios.get(serverurl + '/chatdata/room-users/' + id)
    .then(response => {
      // handle success
      console.log("Username:", user_name, "Reponse:" , response.data);
      if(isStringInArray(user_name, response.data) == true)
      {
        StartRoom();
      }
      else
      {
        navigate('/chat');
      }
      })
    .catch(error => {
      // handle error
      console.log(error);
      navigate('/chat');
    });
    }

}

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

const addUserToChatRoom = async (userName : string, roomId : string | undefined) => {
  try {
    const response = await axios.post(serverurl + `/chatdata/add-user-room/${roomId}`, {
      name: userName
    });
    return response.data;
  } catch (error) {
    console.error(error);
  }
};

function AddUserToRoom(user : string)
{
  addUserToChatRoom(user, id);
}

function removeSubstring(str: string | undefined, substring: string) {
  if (!str) {
    return '';
  }
  return str.replace(substring, '');
}

if (renderPage == false && promptShown == true)
{
  return (
  <div>
    <label>Password:</label>
    <input type="password" id="passwordInput" onChange={(event) => setEnteredPassword(event.target.value)}/>
    <button onClick={handlePassword} id="submitPasswordButton">Submit</button>
  </div>
  );
}
else{
return (
<div>
<h1>Chat - {removeSubstring(data?.name, username)} {id}</h1>
<div>
<label htmlFor="message">Message:</label>
<input type="text" id="message" value={message} onChange={(e) => setMessage(e.target.value)} />
</div>
<ul>
{ messages.map((m, index) => {
  if (blockedUsers.indexOf(m.user) !== -1) {
  }
  else
  {
    console.log(blockedUsers);
    console.log(m.user);
    return <Message username={username} index={index} user={m.user} message={m.message} />
  }
}) }
</ul>
<button onClick={handleSendMessage}>Send Message</button>
{data?.type == 'private' && <UserSearch btnName="Add User To This ROOM!" handleUser={AddUserToRoom}/>}
</div>
);
}
}
export default Chatroom;