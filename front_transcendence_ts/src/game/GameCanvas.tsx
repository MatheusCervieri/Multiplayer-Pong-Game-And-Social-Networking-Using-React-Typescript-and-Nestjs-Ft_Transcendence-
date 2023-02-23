import React, { useRef, useEffect, useState } from 'react';
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
  const navigate = useNavigate();
  const { id } = useParams<{ id: string | undefined }>();
  const { racketWidth, racketHeight, racketColor, gameData, socket, myName } = props;
  const [height , setHeight] = useState<number>(0);
  const [width , setWidth] = useState<number>(0);
  const [ball, setBall] = useState({ x: 200, y: 150, vx: 5, vy: 5 });

  useEffect(() => {
    setHeight(gameData.height);
    setWidth(gameData.width);
  }, []);

  useEffect(() => {
    if (canvasRef.current) {
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');
      
      if (context) {
        // Draw the left racket
        context.fillStyle = 'red';
        context.fillRect(0,0,width, height);

        context.fillStyle = racketColor;
        context.fillRect(0, gameData.player1RacketPosition,  gameData.racketWidth,  gameData.racketHeight);
        
        // Draw the right racket
        context.fillStyle = racketColor;
        context.fillRect(width - racketWidth, gameData.player2RacketPosition,  gameData.racketWidth,  gameData.racketHeight);

        // Draw the ball
        context.beginPath();
        context.arc(gameData.ballX, gameData.ballY, gameData.ballRadiues , 0, 2 * Math.PI);
        context.fillStyle = "#FFFFFF";
        context.fill();
      }
    }
  }, [height, width, canvasRef, width, height, racketWidth, racketHeight, racketColor, gameData.player1RacketPosition, gameData.player2RacketPosition, gameData.ballX, gameData.ballY]);

  function moveRacket(direction: string)
  {
    console.log(myName);
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
    {height !== 0 && width !== 0 && <canvas ref={canvasRef} width={width} height={height} />}
    </>
  );
};

export default GameCanvas;