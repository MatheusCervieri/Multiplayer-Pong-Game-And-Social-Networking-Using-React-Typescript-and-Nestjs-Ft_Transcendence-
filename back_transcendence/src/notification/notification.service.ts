import { forwardRef, Inject, Injectable } from "@nestjs/common";
import { Socket } from 'socket.io';
import { CustomSocket, NotificationGateway } from "./notification.gateway";



@Injectable()
export class NotificationService {

  private connectedUsers: CustomSocket[] = [];

  constructor(
    @Inject(forwardRef(() => NotificationGateway))
    private notificationGateway: NotificationGateway,
    
  ) {
    
  }

  async connectUser(client: CustomSocket) {
    this.connectedUsers.push(client);
    console.log(this.connectedUsers);
  }

  async disconnectClient(client : Socket) {
      //Disconect the client from the connectUsers array.
      this.connectedUsers = this.connectedUsers.filter(c => c.id !== client.id);
      console.log(this.connectedUsers);
  }
  


}