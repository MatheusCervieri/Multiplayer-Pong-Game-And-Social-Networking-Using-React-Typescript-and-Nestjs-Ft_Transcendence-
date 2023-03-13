import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import { io } from 'socket.io-client';
import GetToken from '../utils/GetToken';
import GameCanvas from './GameCanvas'
import Lobby from './Lobby';
import { RTGameRoomInterface, defaultGameRoom } from './roominterface'
import  instance from '../confs/axios_information';
import GameFinalScream from './GameFinalScream';
import GamePauseScream from './GamePauseScream';

const socket = io("http://localhost:8002");

export default function Game() {
  const [myName, setMyName] = useState<string>('');
  const navigate = useNavigate();
  const [gameData, setGameData] = useState<any>(defaultGameRoom);
  const [gameRequestData, setGameRequestData] = useState<any>();
  const [gameRunning, setGameRunning] = useState<boolean>(false);
  const [isConnected, setIsConnected] = useState(false);
  const { id } = useParams<{ id: string | undefined }>();

  function getGameInformation()
  {
    const token = localStorage.getItem('token');
    instance.get('games/information/' + id, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  })
    .then(response => {
      
      setGameRequestData(response.data);
      setGameRunning(response.data.isRunning);
    })
    .catch(error => {
      console.error(error);
    });
  }

  useEffect(() => {
    //Make a axios requistion to get the game information. 
    //If the game is not found, redirect to the home page.
    //If the game is found, set the game requestData.
    //If the game is found and the game is running, set the gameRunning to true.
    //If the game is found and the game is not running, set the gameRunning to false.
    getGameInformation();
  }, []);

  useEffect(() => {
    if(gameData.status === 'finished')
    {
      setGameRunning(false);
    }
  }, []);

  useEffect(() => {
    if (gameRunning === true)
    {
    socket.on("connect", () => {
        setIsConnected(true);
    });
    socket.on("disconnect", () => {
        setIsConnected(false);
    });
    socket.on('game-update', (data: any) => {
      //
      setGameData(data);
      if(data.status === 'finished')
      {
        setGameRunning(false);
        //getGameInformation();
      }
    });
    return () => {
        socket.off('connect');
        socket.off('disconnect');
      };
    }
    else {
      // gameRunning is false, remove all the listeners
      socket.off('connect');
      socket.off('disconnect');
      socket.off('game-update');
    }
}, [gameRunning]);

useEffect(() => {
  const token = localStorage.getItem('token');
  
  if(gameRunning === true)
    socket.emit('authenticate', { token: token , game_id: id});
  GetToken(navigate, setMyName);

}, [gameRunning]);

    const canvasProps = {
        width: 360,
        height: 270,
        racketWidth: 10,
        racketHeight: 60,
        racketColor: "#FFFFFF",
        gameData: gameData,
        socket: socket,
        myName: myName,
      };
  
  return (
    <>
    {gameRunning === true && gameData.status === 'lobby' && <Lobby myName={myName} socket={socket} gameData={gameData}/>}
    {gameRunning === true && myName !== '' && gameData.status === 'playing' && <GameCanvas {...canvasProps} />}
    {gameRunning === true && gameData.status === 'paused' && <GamePauseScream gameData={gameData}/>}
    {gameRunning === false && <GameFinalScream gameData={gameRequestData} myuser={myName} />}
    </>
  )
}