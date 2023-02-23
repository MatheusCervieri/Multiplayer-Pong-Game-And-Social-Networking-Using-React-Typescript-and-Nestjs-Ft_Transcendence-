export interface RTGameRoomInterface {
    id: number,
    status: 'lobby' | 'playing' | 'paused' | 'finished';
    player1IsConnected: boolean,
    player2IsConnected: boolean,
    player1Name: string,
    player2Name: string,
    timeToStart: number,
    creationDate: number,
    elepsedTime: number,
    racketVelocity: number,
    player1Score: number,
    player2Score: number,
    racketWidth: number,
    racketHeight: number,
    player1RacketPosition: number,
    player2RacketPosition: number,
    width: number,
    height: number,
    ballRadiues: number,
    ballX: number,
    ballY: number,
    ballVx: number,
    ballVy: number,
    firstBallPosition: number,
    player1PauseTime: number,
    player2PauseTime: number,
}

export const defaultGameRoom : RTGameRoomInterface = {
    id: 0,
    status: 'lobby',
    player1IsConnected: false,
    player2IsConnected: false,
    player1Name: "",
    player2Name: "",
    creationDate: 0,
    timeToStart: 10000,
    elepsedTime: 0,
    racketVelocity: 10,
    player1Score: 0,
    player2Score: 0,
    racketWidth: 10,
    racketHeight: 60,
    player1RacketPosition: 100,
    player2RacketPosition: 100,
    width: 360,
    height: 270,
    ballRadiues: 10,
    ballX: 100,
    ballY: 100,
    ballVx: 7,
    ballVy: 7,
    firstBallPosition: 100,
    player1PauseTime: 10000,
    player2PauseTime: 10000,
};