import { MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { ConnectedSocket } from '@nestjs/websockets';
import { ChatRoom, Message } from 'src/ChatRoom_database/ChatRoom.entity';
import { ChatRoomService } from 'src/ChatRoom_database/ChatRoom.service';
import { MessageService } from 'src/ChatRoom_database/Message.service';
import { NotificationService } from './notification.service';
import { UsersService } from 'src/user_database/user.service';
import { forwardRef, Inject } from '@nestjs/common';

export interface CustomSocket extends Socket {
  user: any,
}

@WebSocketGateway(8003, {cors: '*' })
export class NotificationGateway implements OnGatewayConnection, OnGatewayDisconnect {
  
  constructor(
    @Inject(forwardRef(() => NotificationService))
    private notificationService: NotificationService,
    @Inject(forwardRef(() => UsersService))
    private readonly userService: UsersService) {
    
  }

  @WebSocketServer() server;

  handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    this.notificationService.disconnectClient(client);
    console.log(`Client ${client.id} disconnected: ${client.id}`);
  }
  @SubscribeMessage('authenticate')
  async authenticate(client: CustomSocket, data : { token: string}) {
    const user = this.userService.findOneByToken(data.token);
    if(user)
    {
      client.user = user;
      this.notificationService.connectUser(client);
    }
  }
}