import React from 'react';
import game from './confs/game_information';
import Displayroute from './Displayroute';
import Header from './login_setup/header_setup/header_setup';
import { createGlobalStyle } from 'styled-components';

console.log(game);
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
    <br></br>
    <Displayroute />
    </>
  );
}

export default App;
