import { forwardRef, Inject, Injectable } from "@nestjs/common";
import { Socket } from 'socket.io';
import { GamesServices } from "src/GamesDatabase/Games.service";
import { CustomSocket, NotificationGateway } from "./notification.gateway";



@Injectable()
export class NotificationService {

  private connectedUsers: CustomSocket[] = [];

  constructor(
    @Inject(forwardRef(() => NotificationGateway))
    private notificationGateway: NotificationGateway,
    @Inject(forwardRef(() => GamesServices))
    private gameService: GamesServices,
  ) {
    
  }

  async connectUser(client: CustomSocket) {
    this.connectedUsers.push(client);
  }

  async disconnectClient(client : Socket) {
      //Disconect the client from the connectUsers array.
      this.connectedUsers = this.connectedUsers.filter(c => c.id !== client.id);
  }

  async checkUsersStatus(userId : any)
  {
    const user = this.connectedUsers.find(c => c.user.id === userId);
    if(user)
    {
      if(this.gameService.checkIfUserIsPlaying(user.user.name))
        return "Playing";
      else
        return "Online";
    }
    else
    {
      return "Offline";
    }
  }

}