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
import {invitation} from './notification.service'

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
    const user = await this.userService.findOneByToken(data.token);
    if(user)
    {
      client.user = user;
      this.notificationService.connectUser(client);
    }
  }

  @SubscribeMessage('invite-game')
  async inviteToPlay(client: CustomSocket, data : { token: string, playerToPlayName : string}) {
    //validate the token.
    console.log("invite-game");
    if (data.token)
    {
      const user = await this.userService.findOneByToken(data.token);
      if(user)
    {
      //validate if the playerToPlayName is a valid player.
      const playerToPlay = await this.userService.findOneByName(data.playerToPlayName);
      if(playerToPlay)
      {
        //validate if the playerToPlay is not the same as the user.
        if(playerToPlay.name != user.name)
        {
          //validate if the playerToPlay status is online and not in a game and offline. 
          this.notificationService.InviteGame(user, playerToPlay);
            //send the invitation to the playerToPlay.
        }
        else
        {
          client.emit("message", "You can´t invite yourself to play.");
        }
      }
    }
    }
    else
      client.emit("meessage", "You need to be logged in to invite someone to play.")
  }


  @SubscribeMessage('decline-invite')
  async declineInvitation(client: CustomSocket, data : { token: string, invitation: invitation}) {
    const user = await this.userService.findOneByToken(data.token);
    if (user)
    {
      this.notificationService.declineInvite(data.invitation);
    }
  }
}