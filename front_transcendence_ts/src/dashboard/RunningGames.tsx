import React, { useEffect } from 'react';
import {useState} from 'react';
import { useNavigate } from 'react-router-dom';
import  instance from '../confs/axios_information';



const RunningGames = () => {
    const [games, setGames] = useState<any[]>([]);
    const navigate = useNavigate();

    function watchBtn(gameid: any)
    {
      navigate('game/'  + gameid);
    }

    useEffect(() => {
      getRunningGames();
    }, []);

    function getRunningGames()
    {
      const token = localStorage.getItem('token');
      instance.get('games/running/' , {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
      .then(response => {
        console.log(response.data);
        setGames(response.data);
      })
      .catch(error => {
        console.error(error);
      });
    }

  return (
    <div>
      <h2>Running Games:</h2>
      <ul>
        {games.map((game) => (
          <li key={game.id}>
            <span>{game.name}</span>
            <button onClick={() => watchBtn(game.id)}>Watch</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default RunningGames;