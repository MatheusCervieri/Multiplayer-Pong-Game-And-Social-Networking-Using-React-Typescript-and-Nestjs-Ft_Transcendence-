export interface RTGameRoomInterface {
    id: number,
    player1IsConnected: boolean;
    player2IsConnected: boolean;
    player1Name: string;
    player2Name: string;
}

export const defaultGameRoom : RTGameRoomInterface = {
    id: 0,
    player1IsConnected: false,
    player2IsConnected: false,
    player1Name: "",
    player2Name: "",
};