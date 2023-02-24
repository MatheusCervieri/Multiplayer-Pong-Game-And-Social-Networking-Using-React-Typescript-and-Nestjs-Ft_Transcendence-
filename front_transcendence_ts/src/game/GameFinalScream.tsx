import React, { useEffect, useState } from 'react'

interface GameFinalScreamProps {
    gameData: any;
    myuser: string;
}

export default function GameFinalScream(props: GameFinalScreamProps) {
    const { gameData, myuser } = props;
    const [playersName, setPlayersName] = useState<string[]>([]);

    useEffect(() => {
        if(gameData)
        {
            console.log("Game data", gameData);
            console.log(gameData.name);
            const splitstr = gameData.name.split(" vs ");
            setPlayersName(splitstr);
        }
    }, [gameData]);

    return (
       //Check if gameData is not null
       <>{gameData && <div>
        <h1>{playersName[0] + ' ' + '(' + gameData.player1FinalScore + ')' + ' vs ' + playersName[1] + ' (' + gameData.player2FinalScore + ')'}</h1>
        {gameData.winnerName === myuser && <h2>You won!</h2>}
        {gameData.winnerName !== myuser && <h2>{gameData.winnerName} won!</h2>}
        <p>Player 1 Score: {gameData.player1FinalScore}</p>
        <p>Player 2 Score: {gameData.player2FinalScore}</p>
    </div>}</>
        
        
    )
}