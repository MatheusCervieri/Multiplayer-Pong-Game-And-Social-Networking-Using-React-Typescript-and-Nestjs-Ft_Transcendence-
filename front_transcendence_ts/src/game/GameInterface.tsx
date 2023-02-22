export interface RTGameRoomInterface {
    id: number,
    status: 'lobby' | 'playing' | 'finished';
    player1IsConnected: boolean,
    player2IsConnected: boolean,
    player1Name: string,
    player2Name: string,
    creationDate: number,
    elepsedTime: number,
}

export const defaultGameRoom : RTGameRoomInterface = {
    id: 0,
    status: 'lobby',
    player1IsConnected: false,
    player2IsConnected: false,
    player1Name: "",
    player2Name: "",
    creationDate: 0,
    elepsedTime: 0,
};