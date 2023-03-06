import React from 'react'
import {useState} from 'react';
import { useParams } from 'react-router-dom';


interface LobbyProps {
    gameData: any,
    socket: any 
    myName: string
}

export default function Lobby(props : LobbyProps) {
    const { gameData } = props;
    const { id } = useParams<{ id: string | undefined }>();
    const [smallRacket, setSmallRacket] = useState(false);
    const [longerGame, setLongerGame] = useState(false);
  //Vote for small racket.
  //Vote for a longer game. 
  //Check if player is playing.

  function handleSmallRacketChange(event: any) {
    setSmallRacket(event.target.checked);
    console.log(props.myName, gameData.player1Name, gameData.player2Name);
    if (props.myName === gameData.player1Name || props.myName === gameData.player2Name)
    {
    const token = localStorage.getItem('token');
    const data = { token: token, game_id: id,  smallRacket: smallRacket, longerGame: longerGame };
    props.socket.emit('vote-game-type', data);
    }
  }

  function handleLongerGameChange(event: any) {
    setLongerGame(event.target.checked);
   
  }

  return (
    <div>
      <h1>Lobby</h1>
      <h2>
        {gameData.player1Name} vs {gameData.player2Name}
      </h2>
      <p>Status: {gameData.status}</p>
      <p>
        Time to start: {Math.floor(gameData.timeToStart / 1000)} seconds;
      </p>
      <p>Player 1 connected: {gameData.player1IsConnected ? "Yes" : "No"}</p>
      <p>Player 2 connected: {gameData.player2IsConnected ? "Yes" : "No"}</p>
      <div>
      <h2>Vote for game options:</h2>
      <label>
        <input type="checkbox" checked={smallRacket} onChange={handleSmallRacketChange} />
        Small Racket
      </label>
      <br />
      <label>
        <input type="checkbox" checked={longerGame} onChange={handleLongerGameChange} />
        Longer Game
      </label>
    </div>
    </div>
  );
}
