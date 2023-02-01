import { MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';

@WebSocketGateway(8001, {cors: '*' })
export class ChatGateway {
  @WebSocketServer() server;
  @SubscribeMessage('message')
  handleMessage(@MessageBody() data: { user:string , message:string}): void {
    console.log(data);
    this.server.emit('message', data);
  }
}
