import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import { io } from 'socket.io-client';
import GameCanvas from './GameCanvas'
import Lobby from './Lobby';

const socket = io("http://localhost:8002");

export default function Game() {
  const [gameData, setGameData] = useState<any>(null);
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
      console.log(data);
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
        width: 800,
        height: 600,
        racketWidth: 10,
        racketHeight: 80,
        racketColor: "#FFFFFF"
      };
  


  return (
    <>
    <Lobby gameData={gameData}/>
    <GameCanvas {...canvasProps}/>
    </>
  )
}
