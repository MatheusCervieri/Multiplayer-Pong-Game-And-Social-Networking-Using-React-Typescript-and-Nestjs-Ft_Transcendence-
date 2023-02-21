import React from 'react'
import GameCanvas from './GameCanvas'

export default function Game() {
    const canvasProps = {
        width: 800,
        height: 600,
        racketWidth: 10,
        racketHeight: 80,
        racketColor: "#FFFFFF"
      };
  return (
    <GameCanvas {...canvasProps}/>
  )
}
