
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Singup from "./login_setup/singup/singup";
import Login from   "./login_setup/login/Login";
import Setname from "./login_setup/Setname/Setname";
import Dashboard from "./dashboard/dashboard";
import ChatInterface from "./chatrooms/ChatInterface";
import TestRoomMessage from "./testchat";
import Chatroom from "./chatrooms/Chatroom";
import Chatroomtest from "./Chatroomtest";
import Createroomaux from "./chatrooms/Createroomaux";
import UserSearch from "./utils/components/Usersearch";
import Profile from "./profile/Profile";

function handleUser()
{
  alert("Hello World");
}

export default function Displayroute() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Singup />} />
        <Route path="/login" element={<Login  />} />
        <Route path="/setname" element={<Setname />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path='/chat' element={<ChatInterface />} />
        <Route path='chat/:id' element={<Chatroom/>} />
        <Route path='profile/:name' element={<Profile/>} />
      </Routes>
    </BrowserRouter>
  )
}
