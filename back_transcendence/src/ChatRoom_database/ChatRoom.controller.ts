import { Body, Controller, Get, HttpCode, HttpStatus, Post, Req } from '@nestjs/common';
import { ChatRoomService } from './ChatRoom.service';
import { UseInterceptors } from '@nestjs/common';
import { AuthMiddleware } from '../user_database/auth.middleware'
import { ChatRoom } from './ChatRoom.entity';

@Controller('chatdata')
//@UseInterceptors(AuthMiddleware)
export class ChatRoomController {
  constructor(private readonly ChatRoomService: ChatRoomService) {}

  @Get('get-rooms')
  async findAll(@Req() request: any): Promise<any> {
    return await this.ChatRoomService.findAll();
  }

  @Post('create-room')
  async create_room(@Req() request: any, @Body() data : any): Promise<any> {
    const new_ChatRoom = new ChatRoom();
    new_ChatRoom.name = data.name;
    return await this.ChatRoomService.create(new_ChatRoom);
  }
  /*
  @Delete('delete-rooms')
  async delete_all_rooms(@Req() request: any): Promise<any> {
  return await this.ChatRoomService.deleteAll();
  }
  */
}