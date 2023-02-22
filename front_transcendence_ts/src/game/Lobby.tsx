import React from 'react'

interface LobbyProps {
    gameData: any
}

export default function Lobby(props : LobbyProps) {
    const { gameData } = props;

  return (
    <div>
      <h1>Lobby</h1>
      <h2>
        {gameData.player1.name} vs {gameData.player2.name}
      </h2>
      <p>Status: {gameData.status}</p>
      <p>
        Time to start: {gameData.timeToStart}{" "}
        {gameData.timeToStart === 1 ? "second" : "seconds"}
      </p>
      <p>Player 1 connected: {gameData.player1IsConnected ? "Yes" : "No"}</p>
      <p>Player 2 connected: {gameData.player2IsConnected ? "Yes" : "No"}</p>
    </div>
  );
}
