
import { BrowserRouter, Routes, Route, RouteMatch } from "react-router-dom";
import Singup from "./login_setup/singup/singup";
import Login from   "./login_setup/login/Login";
import Setname from "./login_setup/Setname/Setname";
import Dashboard from "./dashboard/dashboard";
import ChatInterface from "./chatrooms/ChatInterface";
import Chatroom from "./chatrooms/Chatroom";
import Profile from "./profile/Profile";
import SetProfileImage from "./login_setup/SetProfileImage/SetProfileImage";
import Game from "./game/Game";
import FindGame from "./game/FindGame";
import RunningGames from "./dashboard/RunningGames";
import Users from "./dashboard/Users";
import { io } from "socket.io-client";
import Notification from "./dashboard/Notification";
import Ranking from "./dashboard/Ranking";
import Authapi from "./42api/Authapi";
import {AuthCallback} from "./42api/AuthCallback";
import SendTwoFaCode from "./login_setup/2fa/SendTwofaCode";
import TwoFaEnable from "./login_setup/2fa/TwoFaEnable";
import { AuthCallbackRegister } from "./42api/AuthCallbackRegister";
import Friends from "./dashboard/Friends";
import MyPerfil from "./dashboard/myperfil/MyPerfil";
import Header from "./header/Header";
import LoginHeader from "./header/LoginHeader";



const socket = io("http://localhost:8003");

export default function Displayroute() {
  return (
    <BrowserRouter>
  <Notification socket={socket} />
  <Routes>
    <Route path="/42" element={<><LoginHeader/><Authapi /></>}/>
    <Route path="/" element={<><LoginHeader/><> <Singup /></></>} />
    <Route path="/login" element={<><LoginHeader/><Login  /></>} />
    <Route path="/auth" element={<><Header socket={socket}/><AuthCallback  /></>} />
    <Route path="/authregister" element={<><Header socket={socket}/><AuthCallbackRegister  /></>} />
    <Route path="/twofa" element={<><Header socket={socket}/><SendTwoFaCode  /></>} />
    <Route path="/setname" element={<><LoginHeader/><Setname /></>} />
    <Route path="/setprofileimage" element={<><LoginHeader/><SetProfileImage /></>} />
    <Route path="/dashboard" element={<><Header socket={socket}/><Dashboard /></>} />
    <Route path="/myperfil" element={<><Header socket={socket}/><MyPerfil /></>} />
    <Route path="/friends" element={<><Header socket={socket}/><Friends socket={socket} /></>} />
    <Route path='/chat' element={<><Header socket={socket}/><ChatInterface /></>} />
    <Route path='/findgame' element={<><Header socket={socket}/><FindGame /></>} />
    <Route path='/watchgame' element={<><Header socket={socket}/><RunningGames/></>} />
    <Route path='/ranking' element={<><Header socket={socket}/><Ranking/></>} />
    <Route path='/users' element={<><Header socket={socket}/><Users socket={socket}/></>} />
    <Route path='chat/:id' element={<><Header socket={socket}/><Chatroom socket={socket}/></>} />
    <Route path='game/:id' element={<><Header socket={socket}/><Game/></>} />
    <Route path='profile/:name' element={<><Header socket={socket}/><Profile/></>} />
  </Routes>
</BrowserRouter>
  )
}
