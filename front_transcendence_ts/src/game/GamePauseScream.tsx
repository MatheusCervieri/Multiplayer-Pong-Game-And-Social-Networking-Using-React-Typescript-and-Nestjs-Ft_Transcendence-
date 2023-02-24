import React from 'react'
import { RTGameRoomInterface } from './roominterface';

interface GamePauseScreamProps {
    gameData: RTGameRoomInterface;
}


export default function GamePauseScream(props:  GamePauseScreamProps) {
    const { gameData } = props;
  return (
    <>
    <div>{!gameData.player1IsConnected && <p>Player 1 is not connected, he has {Math.floor(gameData.player1PauseTime / 1000)} seconds to reconnect </p>}</div>
    <div>{!gameData.player2IsConnected && <p>Player 2 is not connected, he has {Math.floor(gameData.player2PauseTime / 1000)} seconds to reconnect </p>}</div>
    </>
    )
}
