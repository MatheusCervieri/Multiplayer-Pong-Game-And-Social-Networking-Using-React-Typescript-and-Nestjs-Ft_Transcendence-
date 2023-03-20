import React, { useRef, useEffect, useState, useLayoutEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import GetToken from '../utils/GetToken';
import styled from 'styled-components';

const GameContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 20px;
`;


const ScoreContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f2f2f2;
  padding: 10px;
  border-radius: 4px;
  margin-bottom: 10px;
  font-size: 24px;
`;

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
        context.fillStyle = "#00b8d9";
        context.fillRect(0, 0, width * scaleX, height * scaleY);

        context.beginPath();
        context.moveTo(0, 0);
        context.lineTo(width * scaleX, 0);
        context.moveTo(0, height * scaleY);
        context.lineTo(width * scaleX, height * scaleY);
        context.strokeStyle = "orange";
        context.lineWidth = 10;
        context.stroke();
        

        context.fillStyle = "orange";
        context.fillRect(gameData.player1RacketXPosition, gameData.player1RacketPosition, gameData.racketWidth, gameData.racketHeight);
          
        // Draw the right racket
        context.fillStyle = "orange";
        context.fillRect(gameData.player2RacketXPosition, gameData.player2RacketPosition, gameData.racketWidth, gameData.racketHeight);
  
        // Draw the ball
        context.beginPath();
        context.arc(gameData.ballX, gameData.ballY, gameData.ballRadiues, 0, 2 * Math.PI);
        context.fill();
      }
    }
  }, [scaleX, scaleY, racketColor, gameData, canvasRef, height, width]);

  function moveRacket(direction: string)
  {
    
    
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
   
     <GameContainer>
    {gameData.player1Score !== undefined && 
    <ScoreContainer>{gameData.player1Score} - {gameData.player2Score}
    </ScoreContainer>}
    <div ref={containerRef} style={{ maxWidth: "360px", maxHeight: "270px", border: "2px solid #FFFFFF", borderRadius: "4px"}}>
    {height !== 0 && width !== 0 && <canvas ref={canvasRef} width={width * scaleX} height={height * scaleY}  style={{ width: '100%', height: '100%' }}/>}
    </div>
    <p>If you are playing use W and S to move!</p>
      </GameContainer>
  );
};

export default GameCanvas;