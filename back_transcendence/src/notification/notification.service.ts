import { forwardRef, Inject, Injectable } from "@nestjs/common";
import { Socket } from 'socket.io';
import { GamesServices } from "src/GamesDatabase/Games.service";
import { CustomSocket, NotificationGateway } from "./notification.gateway";

export interface invitation {
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
    const playerThatInvited = this.connectedUsers.find(c => c.user.id === PlayerThatInvited.id);
    const invitedPlayer = this.connectedUsers.find(c => c.user.id === InvitedUser.id);

    if(InvitedPlayerStatus == "Online")
    {
      //create a invitation. 
      const invitation : invitation = {
        playerThatInvited: PlayerThatInvited,
        invitedPlayer: InvitedUser,
        id: 0,
    }
    
      //Check if player is already in a game intead of checking if the player has a invitation. 
      if(this.gameService.checkIfUserIsPlaying(playerThatInvited.user.name))
      {
        playerThatInvited.emit("message", "You already is in a game!");
      }
      else
      {
        const gamedatabase = await this.gameService.createInviteGame(playerThatInvited, invitedPlayer);
        invitation.id = gamedatabase.id;
        this.invitations.push(invitation);
        //send the invitation to the playerToPlay.
        
        //this.notificationGateway.server.emit('receive-invitation', invitation);
        invitedPlayer.emit("receive-invitation", invitation);

        
        playerThatInvited.emit("invitation-work", invitation);
        
        console.log("Chegou no final");
      }
    }
    else
      playerThatInvited.emit("message", "Player is not avaliable to play!");
  }
  async declineInvite(invitation : invitation)
  {
    console.log("Decline invitation -- - - -- - -- -- ");
    //remove the invitation from the invitations array.
    console.log(this.invitations); 
    this.invitations = this.invitations.filter(i => i.id !== invitation.id);
    console.log(this.invitations); 
    //finish the game in the database.
    console.log("invitation id", invitation.id);
    await this.gameService.finishgameDecline(invitation.id);

  }
}