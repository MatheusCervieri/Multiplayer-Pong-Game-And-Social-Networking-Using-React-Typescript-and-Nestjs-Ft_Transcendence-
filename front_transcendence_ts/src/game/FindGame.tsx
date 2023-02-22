import React, { useEffect, useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom';
import { io } from 'socket.io-client';

const socket = io("http://localhost:8002");

export default function FindGame() {
    const [isConnected, setIsConnected] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        socket.on("connect", () => {
            setIsConnected(true);
        });
        socket.on("disconnect", () => {
            setIsConnected(false);
        });
        socket.on("game-found", (data: any) => {navigate('/game/' + data.id)});
        return () => {
            socket.off('connect');
            socket.off('disconnect');
            socket.off('game-found');
          };
    }, []);

    useEffect(() => {
        const token = localStorage.getItem('token');
        socket.emit('join-queue', { token: token });
    }, []);

  return (
    <div>FindGame</div>
  )
}
