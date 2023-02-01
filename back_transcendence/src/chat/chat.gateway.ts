import { MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { ConnectedSocket } from '@nestjs/websockets';

//https://socket.io/pt-br/docs/v3/rooms/ 

@WebSocketGateway(8001, {cors: '*' })
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
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

  @SubscribeMessage('leave-room')
  handleLeaveRoom(client: Socket, room: string) {
    client.leave(room);
    console.log(`Client ${client.id} left room: ${room}`);
  }

  @SubscribeMessage('message')
  handleMessage(@ConnectedSocket() client: Socket, @MessageBody() data: { user:string , message:string, roomid: string}): void {
    console.log("Received message: ", client.id, data);
    this.server.to(data.roomid).emit('message', data);
  }
}