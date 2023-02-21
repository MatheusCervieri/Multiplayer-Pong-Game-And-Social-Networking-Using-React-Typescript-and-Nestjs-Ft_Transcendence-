import React, { useEffect, useState } from 'react'
import { io } from 'socket.io-client';

const socket = io("http://localhost:8002");

export default function FindGame() {
    const [isConnected, setIsConnected] = useState(false);
    
    useEffect(() => {
        socket.on("connect", () => {
            setIsConnected(true);
        });
        socket.on("disconnect", () => {
            setIsConnected(false);
        });
        socket.on("game-found", (data: any) => {console.log("Game was found", data);});
        return () => {
            socket.off('connect');
            socket.off('disconnect');
            socket.off('game-found');
          };
    }, []);

    useEffect(() => {
        socket.emit('join-queue', { name: 'test' });
    }, []);
    
  return (
    <div>FindGame</div>
  )
}
