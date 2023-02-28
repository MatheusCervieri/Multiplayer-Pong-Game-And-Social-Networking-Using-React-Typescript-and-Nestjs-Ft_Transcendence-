import { forwardRef, Inject, Injectable } from "@nestjs/common";
import { Socket } from 'socket.io';
import { GamesServices } from "src/GamesDatabase/Games.service";
import { CustomSocket, NotificationGateway } from "./notification.gateway";

interface invitation {
  playerThatInvited: any,
  invitedPlayer: any,
  id: any,
}

@Injectable()
export class NotificationService {

  private connectedUsers: CustomSocket[] = [];
  private invitations: invitation[] = [];

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

  async InviteGame(PlayerThatInvited: any, InvitedUser : any)	{
    //validate if the playerToPlay status is online and not in a game and offline. 
    console.log("Chegou na função invite game");
    const InvitedPlayerStatus = await this.checkUsersStatus(InvitedUser.id);
    
    if(InvitedPlayerStatus == "Online")
    {
      //create a invitation. 
      const invitation : invitation = {
        playerThatInvited: PlayerThatInvited,
        invitedPlayer: InvitedUser,
        id: 0;
      }
      //check if the player already invited someone.
      
      const invitationExists = this.invitations.find(i => i.playerThatInvited.id === PlayerThatInvited.id);
      if(invitationExists)
      {
        const playerThatInvited = this.connectedUsers.find(c => c.user.id === PlayerThatInvited.id);
        playerThatInvited.emit("message", "You already invited someone.");
        //return a error message: You already invited someone. 
      }
      else
      {
        
        const gamedatabase = await this.gameService.createInviteGame(PlayerThatInvited.name, InvitedUser.name);
        invitation.id = gamedatabase.id;
        this.invitations.push(invitation);
        //send the invitation to the playerToPlay.
        const invitedPlayer = this.connectedUsers.find(c => c.user.id === InvitedUser.id);
        //this.notificationGateway.server.emit('receive-invitation', invitation);
        invitedPlayer.emit("receive-invitation", invitation);

        const playerThatInvited = this.connectedUsers.find(c => c.user.id === PlayerThatInvited.id);
        playerThatInvited.emit("invitation-work", invitation);
        
        console.log("Chegou no final");
     }
      //invite to play.
    }
  }
}