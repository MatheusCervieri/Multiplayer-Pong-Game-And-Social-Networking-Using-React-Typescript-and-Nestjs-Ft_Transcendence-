import React, { useEffect, useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom';
import { io } from 'socket.io-client';
import styled, { keyframes } from 'styled-components';

const Load = keyframes`
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
`;

const LoadingScreen = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
`;

const Loader = styled.div`
  border: 6px solid #f3f3f3;
  border-top: 6px solid #3498db;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  animation: ${Load} 2s linear infinite;
`;

const Message = styled.p`
  font-size: 24px;
  margin-top: 20px;
`;

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
      <LoadingScreen>
        <Loader />
        <Message>Searching a game...</Message>
      </LoadingScreen>
    );
}
