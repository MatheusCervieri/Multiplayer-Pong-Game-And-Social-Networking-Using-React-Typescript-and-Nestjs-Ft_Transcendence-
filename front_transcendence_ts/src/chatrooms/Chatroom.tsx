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
import styled from 'styled-components';
import { useRef } from 'react';
import Roominfo from './Roominfo';
import Leaveroom from './Leaveroom';
import Useradmin from './Useradmin';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  border: 1px solid #007bff;
  border-radius: 5px;
  overflow: hidden;
  margin: 10px;
  padding: 0;
`;

const ChatHeader = styled.h1`
  display: flex;
  justify-content: space-between;
  background-color: #007bff;
  color: white;
  font-size: 24px;
  padding: 16px;
  margin: 0;
`;

const Titlediv = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0;
`;


const ChatButtons = styled.div`
  display: flex;
  
`;

const InputContainer = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 20px;
  margin: 10px;
`;

const Input = styled.input`
  font-size: 18px;
  padding: 10px;
  border-radius: 5px;
  border: 1px solid #007bff;
  width: 80%;
`;

const MessageContainer = styled.ul`
  list-style: none;
  height: 300px;
  overflow-y: scroll;
  padding: 0;
`;

const SendButton = styled.button`
  background-color: #007bff;
  color: #fff;
  font-size: 18px;
  padding: 10px 20px;
  border-radius: 5px;
  border: none;
  cursor: pointer;
  width: 20%;
  &:hover {
    background-color: #444;
  }
`;

const FormContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 20px;
`;

const Label = styled.label`
  font-size: 18px;
  margin-bottom: 5px;
`;

const PasswordInput = styled.input`
  width: 300px;
  height: 30px;
  font-size: 18px;
  margin-bottom: 10px;
  padding: 5px;
  border-radius: 5px;
  border: none;
`;

const SubmitButton = styled.button`
  width: 150px;
  height: 40px;
  font-size: 18px;
  color: white;
  background-color: #007bff;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  &:hover {
    background-color: lightblue;
    color: white;
  }
`;

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
const messageContainerRef = useRef<HTMLUListElement>(null);
const [showInfo, setShowInfo] = useState<boolean>(false);
const [UserInformation, setUserInformation] = useState<any>();
const navigate = useNavigate();

useEffect(() => {
  if(messageContainerRef.current)
    messageContainerRef.current.scrollTop = messageContainerRef.current.scrollHeight;
}, [messages]);

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
  //Carregar o owner.
  //Caregar os administradores. 
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
    AddUserToRoom(username);
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
      AddUserToRoom(username);
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
setMessage('');
}

function handleRoom(){
  socket.emit('join-room', { name: username, room_id: id });
}

const addUserToChatRoom = async (userName : string, roomId : string | undefined) => {
  const token = localStorage.getItem('token');
  try {
    const response = await axios.post(serverurl + `/room/add-user-room/${roomId}`, {
      name: userName
    }, 
    {
      headers: {
        'Authorization': `Bearer ${token}`
      }
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

const handleKeyDown = (event: any) => {
  if (event.keyCode === 13) {
    handleSendMessage();
  }
};

if (renderPage == false && promptShown == true)
{
  return (
    <FormContainer>
      <Label htmlFor="passwordInput">Password:</Label>
      <PasswordInput type="password" id="passwordInput" onChange={(event) => setEnteredPassword(event.target.value)} />
      <SubmitButton onClick={handlePassword} id="submitPasswordButton">Submit</SubmitButton>
    </FormContainer>
  );
}
else{
  return (
    <>
    {showInfo && <Useradmin username={username} information={UserInformation}/>}
    <Container>
    
    <ChatHeader>
    <Titlediv>
      {removeSubstring(data?.name, username)}
    </Titlediv>
    <ChatButtons>
    <Roominfo setShowInfo={setShowInfo} showInfo={showInfo} username={username} UserInformation={UserInformation} setUserInformation={setUserInformation}/>
    <Leaveroom/>
    </ChatButtons>
    </ChatHeader>
    <MessageContainer ref={messageContainerRef}>
    { messages.map((m, index) => {
    if (blockedUsers.indexOf(m.user) !== -1) {
    }
    else {
    console.log(blockedUsers);
    console.log(m.user);
    return <Message username={username} index={index} user={m.user} message={m.message} setBlockedUsers={setBlockedUsers} />
    }
    
    }) }
    </MessageContainer>
    <InputContainer>
    <Input type="text" id="message" value={message} onChange={(e) => setMessage(e.target.value)} onKeyDown={handleKeyDown}/>
    <SendButton onClick={handleSendMessage}>Send!</SendButton>
    </InputContainer>
   
    {data?.type == 'private' && <UserSearch btnName="Add User To This ROOM!" handleUser={AddUserToRoom}/>}
    </Container>
    </>
    );
}
}
export default Chatroom;