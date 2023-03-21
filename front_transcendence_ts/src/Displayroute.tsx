
import { BrowserRouter, Routes, Route } from "react-router-dom";
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
import { AuthCallbackRegister } from "./42api/AuthCallbackRegister";
import Friends from "./dashboard/Friends";
import MyPerfil from "./dashboard/myperfil/MyPerfil";
import Header from "./header/Header";
import LoginHeader from "./header/LoginHeader";
import TestLogin from "./login_setup/TestLogin/TestLogin";
import CheckLogin from "./CheckLogin";




const socket = io("http://localhost:8003");

export default function Displayroute() {
  return (
    <BrowserRouter>
  <Notification socket={socket} />
  <Routes>
    <Route path="/test" element={<><LoginHeader/><TestLogin /></>}/>
    <Route path="/" element={<><LoginHeader/><> <Authapi /></></>} />
    <Route path="/auth" element={<><Header socket={socket}/><AuthCallback  /></>} />
    <Route path="/authregister" element={<><Header socket={socket}/><AuthCallbackRegister  /></>} />
    <Route path="/twofa" element={<><Header socket={socket}/><SendTwoFaCode  /></>} />
    <Route path="/setname" element={<><CheckLogin /><LoginHeader/><Setname /></>} />
    <Route path="/setprofileimage" element={<><CheckLogin /><LoginHeader/><SetProfileImage /></>} />
    <Route path="/dashboard" element={<><CheckLogin /><Header socket={socket}/><Dashboard socket={socket} /></>} />
    <Route path="/myperfil" element={<><CheckLogin /><Header socket={socket}/><MyPerfil /></>} />
    <Route path="/friends" element={<><CheckLogin /><Header socket={socket}/><Friends socket={socket} /></>} />
    <Route path='/chat' element={<><CheckLogin /><Header socket={socket}/><ChatInterface /></>} />
    <Route path='/findgame' element={<><CheckLogin /><Header socket={socket}/><FindGame /></>} />
    <Route path='/watchgame' element={<><CheckLogin /><Header socket={socket}/><RunningGames/></>} />
    <Route path='/ranking' element={<><CheckLogin /><Header socket={socket}/><Ranking/></>} />
    <Route path='/users' element={<><CheckLogin /><Header socket={socket}/><Users socket={socket}/></>} />
    <Route path='chat/:id' element={<><CheckLogin /><Header socket={socket}/><Chatroom socket={socket}/></>} />
    <Route path='game/:id' element={<><CheckLogin /><Header socket={socket}/><Game/></>} />
    <Route path='profile/:name' element={<><CheckLogin /><Header socket={socket}/><Profile/></>} />
  </Routes>
</BrowserRouter>
  )
}
