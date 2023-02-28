import React, { useEffect } from 'react';
import game from './confs/game_information';
import Displayroute from './Displayroute';
import Header from './login_setup/header_setup/header_setup';
import { createGlobalStyle } from 'styled-components';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { io } from 'socket.io-client';

console.log(game);


const socket = io("http://localhost:8003");

interface invitation {
  playerThatInvited: any,
  invitedPlayer: any,
}

const GlobalStyle = createGlobalStyle`
  body {
    font-family: Arial, sans-serif;
    background-color: #f2f2f2;
    margin: 0;
    padding: 0;
  }
`;

function App() {
  useEffect(() => {
    
    socket.on("connect", () => {
      
    });
    socket.on("disconnect", () => {
     
    });

    socket.on("receive-invitation", (data: invitation) => {
      toast.error("You have been invite to someone");
    });

    socket.on("invitation-work", (data: invitation) => {
      toast.error("You invite someone to play with you");
    });


    socket.on("message", (data: any) => {
      toast.error(data);
    });

    return () => {
        socket.off('connect');
        socket.off('disconnect');
      };
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token)
      socket.emit('authenticate', { token: token});
  }, []);

  return (
    <>
    <GlobalStyle />
    <Header game={game} />
    <ToastContainer />
    <br></br>
    <Displayroute socket={socket}/>
    </>
  );
}

export default App;
