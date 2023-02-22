export interface RTGameRoomInterface {
    id: number,
    status: 'lobby' | 'playing' | 'finished';
    player1IsConnected: boolean,
    player2IsConnected: boolean,
    player1Name: string,
    player2Name: string,
    timeToStart: number,
    creationDate: number,
    elepsedTime: number,
    player1Score: number,
    player2Score: number,
    player1RacketPosition: number,
    player2RacketPosition: number,
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
    player1Score: 0,
    player2Score: 0,
    player1RacketPosition: 100,
    player2RacketPosition: 100,
};
