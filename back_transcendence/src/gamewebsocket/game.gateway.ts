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

//https://socket.io/pt-br/docs/v3/rooms/ 

@WebSocketGateway(8002, {cors: '*' })
export class GameGateway implements OnGatewayConnection, OnGatewayDisconnect {
  private queue: any[];
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

  handleDisconnect(client: Socket) {
    this.connectedUsers = this.connectedUsers.filter(user => user !== client.id);
    console.log(`Client ${client.id} disconnected: ${client.id}`);
  }

  @SubscribeMessage('join-room')
  handleJoinRoom(client: Socket, data : { name: string , room_id: string}) {
    client.join(data.room_id);
    console.log(`Client ${client.id} joined room: ${data.room_id}`);
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
        
        const game = new Game();
        game.name = player1.user.username + " vs " + player2.user.username;
        game.player1Id = player1.user.id;
        game.player2Id = player2.user.id;
        await this.gameService.create(game);
        //Create a new game and add the players to it
        player1.client.emit('game-found', { id : game.id });
        player2.client.emit('game-found', { id: game.id });
       
      }
    }
  }

  
  @SubscribeMessage('leave-room')
  handleLeaveRoom(client: Socket, room: string) {
    client.leave(room);
    console.log(`Client ${client.id} left room: ${room}`);
  }


  @SubscribeMessage('message')
  async handleMessage(client: Socket, data: { user:string , message:string, roomid: string}) {
    this.server.to(data.roomid).emit('message', data);
  }
}