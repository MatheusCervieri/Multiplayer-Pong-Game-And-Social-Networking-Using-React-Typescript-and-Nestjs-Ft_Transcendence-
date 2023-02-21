import { MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { ConnectedSocket } from '@nestjs/websockets';
import { ChatRoom, Message } from 'src/ChatRoom_database/ChatRoom.entity';
import { ChatRoomService } from 'src/ChatRoom_database/ChatRoom.service';
import { MessageService } from 'src/ChatRoom_database/Message.service';

//https://socket.io/pt-br/docs/v3/rooms/ 

@WebSocketGateway(8002, {cors: '*' })
export class GameGateway implements OnGatewayConnection, OnGatewayDisconnect {
  constructor() {}

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
  handleJoinQueie(client: Socket, data : { name: string }) {
    console.log("Join queue");

    const gameid = 10;
    client.emit('game-found', gameid);
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