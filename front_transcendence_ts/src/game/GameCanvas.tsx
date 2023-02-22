import React, { useRef, useEffect, useState } from 'react';

interface GameCanvasProps {
  width: number;
  height: number;
  racketWidth: number;
  racketHeight: number;
  racketColor: string;
}

const GameCanvas: React.FC<GameCanvasProps> = (props) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { width, height, racketWidth, racketHeight, racketColor } = props;
  const [leftRacketPosition, setLeftRacketPosition] = useState(100);
  const [rightRacketPosition, setRightRacketPosition] = useState(100);

  const [ball, setBall] = useState({ x: 400, y: 300, vx: 5, vy: 5 });

  useEffect(() => {
    if (canvasRef.current) {
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');
      
      if (context) {
        // Draw the left racket
        context.fillStyle = 'red';
        context.fillRect(0,0,width, height);

        context.fillStyle = racketColor;
        context.fillRect(0, leftRacketPosition, racketWidth, racketHeight);
        
        // Draw the right racket
        context.fillStyle = racketColor;
        context.fillRect(width - racketWidth, rightRacketPosition, racketWidth, racketHeight);

        // Draw the ball
        context.beginPath();
        context.arc(ball.x, ball.y, 10, 0, 2 * Math.PI);
        context.fillStyle = "#FFFFFF";
        context.fill();
      }
    }
  }, [canvasRef, width, height, racketWidth, racketHeight, racketColor, leftRacketPosition, rightRacketPosition, ball]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      switch (event.key) {
        case "w":
          setLeftRacketPosition(leftRacketPosition - 10);
          break;
        case "s":
          setLeftRacketPosition(leftRacketPosition + 10);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [leftRacketPosition, rightRacketPosition]);


  useEffect(() => {
    const interval = setInterval(() => {
      
      //moveBall();
    }, 16);
  
    return () => clearInterval(interval);
  }, [ball]);

  function moveBall() {
    console.log(ball);

    setBall({
      x: ball.x + ball.vx,
      y: ball.y + ball.vy,
      vx: ball.vx,
      vy: ball.vy
    });
  }
  
  
  return (
    <canvas ref={canvasRef} width={width} height={height} />
  );
};

export default GameCanvas;