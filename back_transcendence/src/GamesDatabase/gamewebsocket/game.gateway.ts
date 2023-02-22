import { MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { ConnectedSocket } from '@nestjs/websockets';
import { ChatRoom, Message } from 'src/ChatRoom_database/ChatRoom.entity';
import { ChatRoomService } from 'src/ChatRoom_database/ChatRoom.service';
import { MessageService } from 'src/ChatRoom_database/Message.service';
import { UsersService } from 'src/user_database/user.service';
import { GamesServices } from 'src/GamesDatabase/Games.service';
import {  Game }  from 'src/GamesDatabase/Game.entity';
import { IoAdapter } from '@nestjs/platform-socket.io';
import { RTGameRoomInterface, defaultGameRoom } from '../roominterface';

//https://socket.io/pt-br/docs/v3/rooms/ 

export interface CustomSocket extends Socket {
  user: any,
  gameRoomId: any,
}
//Basicamente eu preciso ter um map the rooms com rooms que contem as informaçoes do jogo. 

@WebSocketGateway(8002, {cors: '*' })
export class GameGateway implements OnGatewayConnection, OnGatewayDisconnect {
  private queue: any[];
  private connectedRooms = new Map<string, RTGameRoomInterface>(); // Map<room_id, RoomInterface> room_id, room_content.

  constructor(
    private readonly userService: UsersService,
    private readonly gameService: GamesServices,
  ) {}

  @WebSocketServer() server;
  connectedUsers = [];

  
  handleConnection(client: Socket) {
    this.connectedUsers.push(client.id);
    console.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: CustomSocket) {
    this.connectedUsers = this.connectedUsers.filter(user => user !== client.id);
    if (this.queue) {
      this.queue = this.queue.filter(player => player.client.id !== client.id);
      console.log("Disconected from queue", client.id);
    }
    if(client.user)
      this.gameService.disconnect(client.user.name, client.gameRoomId);
    console.log(`Client ${client.id} disconnected: ${client.id}`);
  }

  @SubscribeMessage('authenticate')
  async authenticate(client: CustomSocket, data : { token: string, game_id: string}) {
    const user = await this.userService.findOneByToken(data.token);
    client.user = user;
    client.gameRoomId = data.game_id;
    client.join(data.game_id);
    console.log(`Client ${client.user.name} authenticated: ${data.token}`);
    this.gameService.authenticate(user.name, data.game_id);
  
    //Create a function at gameservice that att the rtgame information about connected users. 
  }

  @SubscribeMessage('move-player')
  async movePlayer(client: CustomSocket, data : { token: string, game_id: string, direction: string}) 
  {
    console.log("Move player");
    const user = await this.userService.findOneByToken(data.token);
    this.gameService.movePlayer(user.name, data.game_id, data.direction);
  }

  @SubscribeMessage('join-queue')
  async handleJoinQueue(client: Socket, data : { token: string }) {
    console.log("Join queue"); 
    const user = await this.userService.findOneByToken(data.token);
    if (user)
    {
      console.log("User found");
      if (this.queue === undefined)
      {
        this.queue = [];
      }
      //Check if the user is already in the queue
      if (this.queue.find(x => x.user.id === user.id) === undefined)
      {
        this.queue.push({client, user});
        console.log("User added to queue");
      }
      if (this.queue.length >= 2)
      {
        console.log("Queue has 2 players");
        const player1 = this.queue.shift();
        const player2 = this.queue.shift();
        
        const game = await this.gameService.createQueueGame(player1, player2);
        console.log(this.gameService.getRtGame(game.id.toString()));
      }
    }
  }

  
}