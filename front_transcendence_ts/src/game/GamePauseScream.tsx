import React from 'react'
import { RTGameRoomInterface } from './roominterface';
import styled from 'styled-components';

interface GamePauseScreamProps {
    gameData: RTGameRoomInterface;
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 20px;
  background-color: #f2f2f2;
  border: 2px solid #00b8d9;
  border-radius: 4px;
  padding: 20px;
`;

const Text = styled.p`
  font-size: 18px;
  color: #333;
  margin: 10px 0;
`;

export default function GamePauseScream(props:  GamePauseScreamProps) {
    const { gameData } = props;
  return (
    <Container>
    {!gameData.player1IsConnected && <Text>Player 1 is not connected, he has {Math.floor(gameData.player1PauseTime / 1000)} seconds to reconnect</Text>}
    {!gameData.player2IsConnected && <Text>Player 2 is not connected, he has {Math.floor(gameData.player2PauseTime / 1000)} seconds to reconnect</Text>}
  </Container>
    )
}
