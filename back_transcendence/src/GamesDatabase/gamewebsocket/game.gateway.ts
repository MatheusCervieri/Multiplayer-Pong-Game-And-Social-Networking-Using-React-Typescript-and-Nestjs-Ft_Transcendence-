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
import { forwardRef, Inject } from '@nestjs/common';

//https://socket.io/pt-br/docs/v3/rooms/ 

export interface CustomSocket extends Socket {
  user: any,
  gameRoomId: any,
}
//Basicamente eu preciso ter um map the rooms com rooms que contem as informaçoes do jogo. 

@WebSocketGateway(8002, {cors: '*' })
export class GameGateway implements OnGatewayConnection, OnGatewayDisconnect {
  

  constructor(
    @Inject(forwardRef(() => UsersService))
    private readonly userService: UsersService,
    @Inject(forwardRef(() => GamesServices))
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
    //Create a function to handle disconection from queue.
    this.gameService.handleQueueDisconnect(client);
    if(client.user)
      this.gameService.disconnect(client.user.name, client.gameRoomId);
    console.log(`Client ${client.id} disconnected: ${client.id}`);
  }

  @SubscribeMessage('authenticate')
  async authenticate(client: CustomSocket, data : { token: string, game_id: string}) {
    console.log("SUPER TEST");
    const user = await this.userService.findOneByToken(data.token);
    client.user = user;
    client.gameRoomId = data.game_id;
    client.join(data.game_id);
    console.log(`Client ${client.user.name} authenticated: ${user.name} ${data.game_id}`);
    this.gameService.authenticate(user.name, data.game_id);
  
    //Create a function at gameservice that att the rtgame information about connected users. 
  }

  @SubscribeMessage('move-player')
  async movePlayer(client: CustomSocket, data : { token: string, game_id: string, direction: string}) 
  {

    const user = await this.userService.findOneByToken(data.token);
    this.gameService.movePlayer(user.name, data.game_id, data.direction);
  }

  @SubscribeMessage('join-queue')
  async handleJoinQueue(client: Socket, data : { token: string }) {
    console.log("Join queue"); 
    this.gameService.handleQueue(data, client);
  }

  
}