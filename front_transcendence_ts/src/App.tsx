import React from 'react';
import game from './confs/game_information';
import Displayroute from './Displayroute';
import Header from './login_setup/header_setup/header_setup';

console.log(game);

function App() {
  return (
    <>
    <Header game={game} />
    <br></br>
    <Displayroute />
    </>
  );
}

export default App;
