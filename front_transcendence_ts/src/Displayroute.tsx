
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Singup from "./login_setup/singup/singup";
import Login from   "./login_setup/login/Login";
import Setname from "./login_setup/Setname/Setname";

export default function Displayroute() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Singup />} />
        <Route path="/login" element={<Login onSubmit={(formData) => console.log(formData)} />} />
        <Route path="/setname" element={<Setname onSubmit={(formData) => console.log(formData)} />} />
      </Routes>
    </BrowserRouter>
  )
}
