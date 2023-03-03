
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
import SetProfileImage from "./login_setup/SetProfileImage/SetProfileImage";
import Game from "./game/Game";
import FindGame from "./game/FindGame";
import RunningGames from "./dashboard/RunningGames";
import Users from "./dashboard/Users";
import { io } from "socket.io-client";
import Notification from "./dashboard/Notification";
import { useState } from "react";
import Ranking from "./dashboard/Ranking";
import Authapi from "./42api/Authapi";
import {AuthCallback} from "./42api/AuthCallback";
import SendTwoFaCode from "./login_setup/2fa/SendTwofaCode";
import TwoFaEnable from "./login_setup/2fa/TwoFaEnable";
import { AuthCallbackRegister } from "./42api/AuthCallbackRegister";



const socket = io("http://localhost:8003");

export default function Displayroute() {
  return (
    <BrowserRouter>
    <Notification socket={socket}/>
      <Routes>
        <Route path="/" element={<Singup />} />
        <Route path="/42" element={< Authapi />}/>
        <Route path="/login" element={<Login  />} />
        <Route path="/auth" element={<AuthCallback  />} />
        <Route path="/authregister" element={<AuthCallbackRegister  />} />
        <Route path="/twofa" element={<SendTwoFaCode  />} />
        <Route path="/enabletwofa" element={<TwoFaEnable  />} />
        <Route path="/setname" element={<Setname />} />
        <Route path="/setprofileimage" element={<SetProfileImage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path='/chat' element={<ChatInterface />} />
        <Route path='/findgame' element={<FindGame />} />
        <Route path='/watchgame' element={<RunningGames/>} />
        <Route path='/ranking' element={<Ranking/>} />
        <Route path='/users' element={<Users socket={socket}/>} />
        <Route path='chat/:id' element={<Chatroom/>} />
        <Route path='game/:id' element={<Game/>} />
        <Route path='profile/:name' element={<Profile/>} />
      </Routes>
    </BrowserRouter>
  )
}
