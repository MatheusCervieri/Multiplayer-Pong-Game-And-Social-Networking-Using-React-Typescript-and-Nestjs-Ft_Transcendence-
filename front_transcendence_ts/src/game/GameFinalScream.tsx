import React, { useEffect, useState } from 'react'
import { Navigate, useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import  instance from '../confs/axios_information';
import styled from "styled-components";

interface GameFinalScreamProps {
    gameData: any;
    myuser: string;
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border: 2px solid #00b8d9;
  border-radius: 10px;
  padding: 20px;
  margin: 20px;
  text-align: center;
`;

const Winner = styled.h2`
  font-size: 24px;
  color: #00b8d9;
  margin-top: 30px;
`;


const Button = styled.button`
  background-color: #00b8d9;
  color: white;
  border: none;
  padding: 10px 20px;
  margin: 10px;
  border-radius: 5px;
  font-size: 16px;
  cursor: pointer;

  &:hover {
    background-color: #0066a0;
  }
`;


export default function GameFinalScream(props: GameFinalScreamProps) {
    const { myuser } = props;
    const [gameData, setGameData] = useState<any>();
    const [playersName, setPlayersName] = useState<string[]>([]);
    const { id } = useParams<{ id: string | undefined }>();
    const navigate = useNavigate();

    useEffect(() => {
        if(gameData)
        {
            console.log("Game data", gameData);
            console.log(gameData.name);
            const splitstr = gameData.name.split(" vs ");
            setPlayersName(splitstr);
            console.log(splitstr[0], splitstr[1]);
        }
    }, [gameData]);

    useEffect(() => {
        getGameInformation();
    }, []);

    function getGameInformation()
    {
      const token = localStorage.getItem('token');
      instance.get('games/information/' + id, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
      .then((response) => {
        console.log(response.data);
        setGameData(response.data);

      })
      .catch((error) => {
        console.error(error);
      });
    }

    return (
      <Container>
        {gameData && (
          <div>
            <h1>
              {playersName[0]} ({gameData.player1FinalScore}) vs {playersName[1]} (
              {gameData.player2FinalScore})
            </h1>
            {gameData.winnerName === "ERROR1" && (
              <Winner>Game Finished Before Start!</Winner>
            )}
            {gameData.winnerName === myuser && <Winner>You Won!</Winner>}
            {gameData.winnerName !== myuser && gameData.winnerName !== "ERROR1" && (
              <Winner>{gameData.winnerName} Won!</Winner>
            )}
            <Button onClick={() => navigate('/dashboard')}>Dashboard</Button>
          </div>
        )}
      </Container>
    );
}