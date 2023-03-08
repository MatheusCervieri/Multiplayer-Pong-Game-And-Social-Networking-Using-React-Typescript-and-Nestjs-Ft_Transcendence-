
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
    <Notification socket={socket}/>
      <Routes>
        <Route path="/42" element={<><LoginHeader/>< Authapi /></>}/>
        <Route path="/" element={<><LoginHeader/><> <Singup /></></>} />
        <Route path="/login" element={<><LoginHeader/><Login  /></>} />
        <Route path="/auth" element={<><Header/><AuthCallback  /></>} />
        <Route path="/authregister" element={<><Header/><AuthCallbackRegister  /></>} />
        <Route path="/twofa" element={<><Header/><SendTwoFaCode  /></>} />
        <Route path="/setname" element={<><LoginHeader/><Setname /></>} />
        <Route path="/setprofileimage" element={<><LoginHeader/><SetProfileImage /></>} />
        <Route path="/dashboard" element={<><Header/><Dashboard /></>} />
        <Route path="/myperfil" element={<><Header/> <MyPerfil /></>} />
        <Route path="/friends" element={<><Header/><Friends socket={socket} /></>} />
        <Route path='/chat' element={<><Header/><ChatInterface /></>} />
        <Route path='/findgame' element={<><Header/><FindGame /></>} />
        <Route path='/watchgame' element={<><Header/><RunningGames/></>} />
        <Route path='/ranking' element={<><Header/><Ranking/></>} />
        <Route path='/users' element={<><Header/><Users socket={socket}/></>} />
        <Route path='chat/:id' element={<><Header/><Chatroom socket={socket}/></>} />
        <Route path='game/:id' element={<><Header/><Game/></>} />
        <Route path='profile/:name' element={<Profile/>} />
      </Routes>
    </BrowserRouter>
  )
}
