import { MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { ConnectedSocket } from '@nestjs/websockets';
import { ChatRoom, Message } from 'src/ChatRoom_database/ChatRoom.entity';
import { ChatRoomService } from 'src/ChatRoom_database/ChatRoom.service';
import { MessageService } from 'src/ChatRoom_database/Message.service';


//https://socket.io/pt-br/docs/v3/rooms/ 


@WebSocketGateway(8001, {cors: '*' })
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  constructor(
    private readonly ChatRoomService: ChatRoomService,
    private readonly MessageService: MessageService) {}

  @WebSocketServer() server;
  connectedUsers = [];

  handleConnection(client: Socket) {
    this.connectedUsers.push(client.id);
    
  }

  handleDisconnect(client: Socket) {
    this.connectedUsers = this.connectedUsers.filter(user => user !== client.id);
    
  }

  @SubscribeMessage('join-room')
  handleJoinRoom(client: Socket, data : { name: string , room_id: string}) {
    client.join(data.room_id);
    
  }


  @SubscribeMessage('leave-room')
  handleLeaveRoom(client: Socket, room: string) {
    client.leave(room);
    
  }

  @SubscribeMessage('update-room')
  updateRoom(client: Socket, data: { message:string, roomid: string}) {
    
    
    this.server.to(data.roomid).emit('update-room', data);
  }

  @SubscribeMessage('message')
  async handleMessage(client: Socket, data: { user:string , message:string, roomid: string}) {
    
    const room = await this.ChatRoomService.findRoomWithUsers(Number(data.roomid)) as ChatRoom;
    
      this.server.to(data.roomid).emit('message', data);
      const data_message = new Message();
      data_message.user = data.user;
      data_message.message = data.message;
      data_message.chatRoom = room;
      await this.MessageService.create(data_message);
  }
}