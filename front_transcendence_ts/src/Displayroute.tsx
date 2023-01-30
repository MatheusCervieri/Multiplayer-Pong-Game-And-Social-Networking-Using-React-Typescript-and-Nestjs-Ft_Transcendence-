
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Singup from "./login_setup/singup/singup";
import Login from   "./login_setup/login/Login";
import Setname from "./login_setup/Setname/Setname";
import Dashboard from "./dashboard/dashboard";
import Chat from "./chat/chat";

export default function Displayroute() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Singup />} />
        <Route path="/login" element={<Login  />} />
        <Route path="/setname" element={<Setname />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path='/chat' element={<Chat />} />
      </Routes>
    </BrowserRouter>
  )
}
