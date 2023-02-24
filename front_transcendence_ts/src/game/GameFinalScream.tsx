import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import  instance from '../confs/axios_information';

interface GameFinalScreamProps {
    gameData: any;
    myuser: string;
}

export default function GameFinalScream(props: GameFinalScreamProps) {
    const { myuser } = props;
    const [gameData, setGameData] = useState<any>();
    const [playersName, setPlayersName] = useState<string[]>([]);
    const { id } = useParams<{ id: string | undefined }>();

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
       <>
       hello
       {gameData && <div>
        <h1>{playersName[0] + ' ' + '(' + gameData.player1FinalScore + ')' + ' vs ' + playersName[1] + ' (' + gameData.player2FinalScore + ')'}</h1>
        {gameData.winnerName === "ERROR1" && <h2>Game Finished Before Start!</h2>}
        {gameData.winnerName === myuser && <h2>You won!</h2>}
        {gameData.winnerName !== myuser && gameData.winnerName !== "ERROR1" && <h2>{gameData.winnerName} won!</h2>}
        <p>Player 1 Score: {gameData.player1FinalScore}</p>
        <p>Player 2 Score: {gameData.player2FinalScore}</p>
    </div>}</>
    )
}