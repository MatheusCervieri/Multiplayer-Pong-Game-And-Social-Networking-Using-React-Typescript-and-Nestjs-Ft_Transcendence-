import React, { useEffect } from 'react';
import game from './confs/game_information';
import Displayroute from './Displayroute';
import Header from './login_setup/header_setup/header_setup';
import { createGlobalStyle } from 'styled-components';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { io } from 'socket.io-client';
import { useNavigate } from 'react-router-dom';






const GlobalStyle = createGlobalStyle`
  body {
    font-family: Arial, sans-serif;
    background-color: #f2f2f2;
    margin: 0;
    padding: 0;
  }
`;

function App() {

  return (
    <>
    <GlobalStyle />
    <Header game={game} />
    <ToastContainer />
    <br></br>
    <Displayroute/>
    </>
  );
}

export default App;
