import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import { io } from 'socket.io-client';
import GameCanvas from './GameCanvas'
import Lobby from './Lobby';
import { RTGameRoomInterface, defaultGameRoom } from './roominterface'

const socket = io("http://localhost:8002");

export default function Game() {
  const [gameData, setGameData] = useState<any>(defaultGameRoom);
  const [isConnected, setIsConnected] = useState(false);
  const { id } = useParams<{ id: string | undefined }>();

  useEffect(() => {
    socket.on("connect", () => {
        setIsConnected(true);
    });
    socket.on("disconnect", () => {
        setIsConnected(false);
    });
    socket.on('game-update', (data: any) => {
      //console.log(data);
      setGameData(data);
    });
    return () => {
        socket.off('connect');
        socket.off('disconnect');
      };
}, []);

useEffect(() => {
  const token = localStorage.getItem('token');
  socket.emit('authenticate', { token: token , game_id: id});
  
}, []);

    const canvasProps = {
        width: 360,
        height: 270,
        racketWidth: 10,
        racketHeight: 60,
        racketColor: "#FFFFFF",
        gameData: gameData,
        socket: socket,
      };
  


  return (
    <>
    {gameData.status === 'lobby' && <Lobby gameData={gameData}/>}
    {gameData.status === 'playing' && <GameCanvas {...canvasProps}/>}
    </>
  )
}