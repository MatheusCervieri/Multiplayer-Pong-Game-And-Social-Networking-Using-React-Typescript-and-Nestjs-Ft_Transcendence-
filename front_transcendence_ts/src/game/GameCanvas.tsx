import React, { useRef, useEffect, useState, useLayoutEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import GetToken from '../utils/GetToken';

interface GameCanvasProps {
  width: number;
  height: number;
  racketWidth: number;
  racketHeight: number;
  racketColor: string;
  gameData: any;
  socket: any;
  myName: string;
}

const GameCanvas: React.FC<GameCanvasProps> = (props) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [scaleX, setScaleX] = useState<number>(1);
  const [scaleY, setScaleY] = useState<number>(1);
  const navigate = useNavigate();
  const { id } = useParams<{ id: string | undefined }>();
  const { racketWidth, racketHeight, racketColor, gameData, socket, myName } = props;
  const [height , setHeight] = useState<number>(0);
  const [width , setWidth] = useState<number>(0);

  useEffect(() => {
    setHeight(gameData.height);
    setWidth(gameData.width);
  }, []);

  useLayoutEffect(() => {
    const container = containerRef.current;
    if (container) {
      const { width: containerWidth, height: containerHeight } = container.getBoundingClientRect();
      //We're using the getBoundingClientRect() method to get the container size, which takes into account any CSS transforms that may affect the element's size
      if (containerWidth < width) {
        setScaleX(containerWidth / width);
      }
      if(containerHeight < height) {
        setScaleY(containerHeight / height);
      }
    }
  }, [containerRef, width, height]);

  useEffect(() => {
    if (canvasRef.current && scaleX && scaleY && racketColor && gameData) {
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');
        
      if (context) {
        // Draw the left racket
        context.fillStyle = 'red';
        context.fillRect(0, 0, width * scaleX, height * scaleY);
  
        context.fillStyle = racketColor;
        context.fillRect(gameData.player1RacketXPosition, gameData.player1RacketPosition, gameData.racketWidth, gameData.racketHeight);
          
        // Draw the right racket
        context.fillStyle = racketColor;
        context.fillRect(gameData.player2RacketXPosition, gameData.player2RacketPosition, gameData.racketWidth, gameData.racketHeight);
  
        // Draw the ball
        context.beginPath();
        context.arc(gameData.ballX, gameData.ballY, gameData.ballRadiues, 0, 2 * Math.PI);
        context.fillStyle = "#FFFFFF";
        context.fill();
      }
    }
  }, [scaleX, scaleY, racketColor, gameData, canvasRef, height, width]);

  function moveRacket(direction: string)
  {
    console.log(myName);
    console.log("wtf");
    if (myName === gameData.player1Name || myName === gameData.player2Name)
    {
    const token = localStorage.getItem('token');
    const data = { token: token, game_id: id, direction: direction };
    socket.emit('move-player', data);
    }
  }


  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      switch (event.key) {
        case "w":
          moveRacket("up");
          break;
        case "s":
          moveRacket("down");
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [gameData.player1RacketPosition, gameData.player2RacketPosition]);

 
  return (
    <>
    {gameData.player1Score !== undefined && <div>Player 1: {gameData.player1Score} - Player 2: {gameData.player2Score}</div>}
    <div ref={containerRef} style={{ maxWidth: "360px", maxHeight: "270px" }}>
    {height !== 0 && width !== 0 && <canvas ref={canvasRef} width={width * scaleX} height={height * scaleY}  style={{ width: '100%', height: '100%' }}/>}
    </div>
    </>
  );
};

export default GameCanvas;