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
  socket: any
}

const GameCanvas: React.FC<GameCanvasProps> = (props) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const navigate = useNavigate();
  const { id } = useParams<{ id: string | undefined }>();
  const { width, height, racketWidth, racketHeight, racketColor, gameData, socket } = props;
  const [ball, setBall] = useState({ x: 200, y: 150, vx: 5, vy: 5 });
  const [myUsername, setMyUsername] = useState('');

  useEffect(() => {
    GetToken(navigate, setMyUsername);
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
        context.fillRect(0, gameData.player1RacketPosition, racketWidth, racketHeight);
        
        // Draw the right racket
        context.fillStyle = racketColor;
        context.fillRect(width - racketWidth, gameData.player2RacketPosition, racketWidth, racketHeight);

        // Draw the ball
        context.beginPath();
        context.arc(gameData.ballX, gameData.ballY, 10, 0, 2 * Math.PI);
        context.fillStyle = "#FFFFFF";
        context.fill();
      }
    }
  }, [canvasRef, width, height, racketWidth, racketHeight, racketColor, gameData.player1RacketPosition, gameData.player2RacketPosition, gameData.ballX, gameData.ballY]);

  function moveRacket(direction: string)
  {
    console.log(myUsername);
    if (myUsername === gameData.player1Name || myUsername === gameData.player2Name)
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
    <canvas ref={canvasRef} width={width} height={height} />
  );
};

export default GameCanvas;