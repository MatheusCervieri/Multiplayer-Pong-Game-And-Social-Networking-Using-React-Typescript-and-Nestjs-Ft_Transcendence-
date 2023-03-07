import React from 'react'
import  instance from '../confs/axios_information';
import {serverurl} from '../confs/axios_information';
import styled from 'styled-components';
import logo42 from '../images/42logo.png';

const LoginButton = styled.button`
display: block;
width: 200px;
height: 50px;
margin: auto;
font-size: 24px;
color: #fff;
background-color: #007bff;
border: none;
border-radius: 8px;
cursor: pointer;
transition: background-color 0.3s ease-in-out;

&:hover {
  background-color: #0062cc;
}
`;

const Logo = styled.img`
  width: 80%;
  max-width: 200px;
  height: auto;
  margin: 30px auto;
  display: block;
  background-color: transparent;
`;


export default function Authapi() {

  async function AuthRequest()
  {
    //make a request using axios instance
    window.location.href = serverurl + '/auth/42';

  }



  return (
    <div>
    <Logo src={logo42} alt="Logo42" />
    <LoginButton onClick={AuthRequest}>Login with 42!</LoginButton>
    </div>
  )
}
