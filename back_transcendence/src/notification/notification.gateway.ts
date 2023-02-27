import { MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { ConnectedSocket } from '@nestjs/websockets';
import { ChatRoom, Message } from 'src/ChatRoom_database/ChatRoom.entity';
import { ChatRoomService } from 'src/ChatRoom_database/ChatRoom.service';
import { MessageService } from 'src/ChatRoom_database/Message.service';


@WebSocketGateway(8003, {cors: '*' })
export class NotificationGateway implements OnGatewayConnection, OnGatewayDisconnect {
  constructor() {}

  @WebSocketServer() server;

  handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`Client ${client.id} disconnected: ${client.id}`);
  }
  @SubscribeMessage('authenticate')
  async authenticate(client: Socket, data : { token: string}) {
   
  }
}