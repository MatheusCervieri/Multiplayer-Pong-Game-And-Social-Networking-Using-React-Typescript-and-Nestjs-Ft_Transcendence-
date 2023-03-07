import React from 'react'
import {useState} from 'react';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import styled from 'styled-components';

const Container = styled.div`
  border: 2px solid #00b8d9;
  border-radius: 10px;
  padding: 20px;
  margin-top: 50px;
  text-align: center;
`;

const Title = styled.h1`
  font-size: 36px;
  margin-bottom: 20px;
  color: #00b8d9;
`;

const Subtitle = styled.h2`
  font-size: 24px;
  margin-bottom: 10px;
  color: #00b8d9;
`;

const Text = styled.p`
  font-size: 18px;
  margin-bottom: 10px;
`;

const Label = styled.label`
  display: block;
  font-size: 18px;
  margin-bottom: 10px;
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 20px;
`;

const Button = styled.button`
  background-color: #00b8d9;
  border: none;
  color: white;
  font-size: 20px;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
  margin-left: 20px;

  &:hover {
    background-color: #006f89;
  }
`;


interface LobbyProps {
    gameData: any,
    socket: any 
    myName: string
}

export default function Lobby(props : LobbyProps) {
    const { gameData } = props;
    const { id } = useParams<{ id: string | undefined }>();
    const [smallRacket, setSmallRacket] = useState<boolean>(false);
    const [longerGame, setLongerGame] = useState<boolean>(false);
  //Vote for small racket.
  //Vote for a longer game. 
  //Check if player is playing.

  function handleSmallRacketChange(event: any) {
    const checkboxstate = event.target.checked;
    setSmallRacket(checkboxstate);
  }

  function handleLongerGameChange(event: any) {
    setLongerGame(event.target.checked);
   
  }

  function vote()
  {
    if (props.myName === gameData.player1Name || props.myName === gameData.player2Name)
    {
    const token = localStorage.getItem('token');
    console.log("Small Racket", smallRacket, "Longer game", longerGame);
    const data = { token: token, game_id: id,  smallRacket: smallRacket, longerGame: longerGame };
    props.socket.emit('vote-game-type', data);
    toast.success("Vote sent");
    }
  }

  return (
    <Container>
      <Title>Lobby</Title>
      <Subtitle>
        {gameData.player1Name} vs {gameData.player2Name}
      </Subtitle>
      <Text>Time to start: {Math.floor(gameData.timeToStart / 1000)} seconds;</Text>
      <Text>Player 1 connected: {gameData.player1IsConnected ? "Yes" : "No"}</Text>
      <Text>Player 2 connected: {gameData.player2IsConnected ? "Yes" : "No"}</Text>
      <div>
        <Subtitle>Vote for game options:</Subtitle>
        <Label>
          <input type="checkbox" onChange={handleSmallRacketChange} />
          Small Racket
        </Label>
        <Label>
          <input type="checkbox" onChange={handleLongerGameChange} />
          Longer Game
        </Label>
        <ButtonContainer>
          <Button onClick={vote}>Vote</Button>
        </ButtonContainer>
      </div>
    </Container>
  );
}
