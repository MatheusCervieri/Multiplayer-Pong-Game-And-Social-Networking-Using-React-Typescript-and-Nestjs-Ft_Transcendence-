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
  async handleMessage(client: Socket, data: { user:string , message:string, roomid: string}) {
    console.log("Received message: ", data, client.id);
    const room = await this.ChatRoomService.findOne(Number(data.roomid)) as ChatRoom;
    const user = room.users.find(user => user.name === data.user);
    if (user === undefined) {
      console.log("User is not in the room!");
      return;
    }
    else if (room.bannedusers.includes(user)) {
      console.log("User is banned from the room!");
      return;
    }
    else if (room.mutedusers.includes(user)) {
      console.log("User is muted from the room!");
      return;
    }
    else{
      this.server.to(data.roomid).emit('message', data);
      const data_message = new Message();
      data_message.user = data.user;
      data_message.message = data.message;
      data_message.chatRoom = room;
      await this.MessageService.create(data_message);
    }
  }
}