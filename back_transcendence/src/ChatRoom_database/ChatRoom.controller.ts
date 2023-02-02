import { Body, Controller, Get, Delete, HttpCode, HttpStatus, Post, Req } from '@nestjs/common';
import { ChatRoomService } from './ChatRoom.service';
import { UseInterceptors } from '@nestjs/common';
import { AuthMiddleware } from '../user_database/auth.middleware'
import { ChatRoom } from './ChatRoom.entity';
import { Param } from '@nestjs/common';

@Controller('chatdata')
//@UseInterceptors(AuthMiddleware)
export class ChatRoomController {
  constructor(private readonly ChatRoomService: ChatRoomService) {}

  @Get('get-rooms')
  async findAll(@Req() request: any): Promise<any> {
    return await this.ChatRoomService.findAll();
  }

  @Get('get-room/:id')
  async findOne(@Param() params: any): Promise<any> {
    return await this.ChatRoomService.findOne(params.id);
  }

  @Get('get-room-messages/:id')
  async findMessages(@Param() params: any): Promise<any> {
    return await this.ChatRoomService.findMessages(params.id);
  }
/*
  export interface Room {
    id: number;
    name: string;
    adm: string; 
    type: string;
    password: string;
}
*/

  @Post('create-room')
  async create_room(@Req() request: any, @Body() data : any): Promise<any> {
    const new_ChatRoom = new ChatRoom();
    new_ChatRoom.name = data.name;
    new_ChatRoom.type = data.type;
    new_ChatRoom.password = data.password;
    new_ChatRoom.adm = data.adm;
    return await this.ChatRoomService.create(new_ChatRoom);
  }
  
  @Delete('delete-rooms')
  async delete_all_rooms(@Req() request: any): Promise<any> {
  return await this.ChatRoomService.deleteAll();
  }
  
}