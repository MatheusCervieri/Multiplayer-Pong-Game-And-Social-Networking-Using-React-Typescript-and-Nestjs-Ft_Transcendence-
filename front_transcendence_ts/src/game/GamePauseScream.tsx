import React from 'react'
import { RTGameRoomInterface } from './roominterface';

interface GamePauseScreamProps {
    gameData: RTGameRoomInterface;
}


export default function GamePauseScream(props:  GamePauseScreamProps) {
    const { gameData } = props;
  return (
    <>
    <div>{!gameData.player1IsConnected && <p>Player 1 is not connected, he has {gameData.player1PauseTime} seconds to reconnect</p>}</div>
    <div>{!gameData.player2IsConnected && <p>Player 2 is not connected, he has {gameData.player2PauseTime} seconds to reconnect</p>}</div>
    </>
    )
}
