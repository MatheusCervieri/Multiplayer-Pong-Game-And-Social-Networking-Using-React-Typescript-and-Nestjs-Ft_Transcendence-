import { Body, Controller, Get, Delete, HttpCode, HttpStatus, Post, Req, HttpException } from '@nestjs/common';
import { ChatRoomService } from './ChatRoom.service';
import { UseInterceptors } from '@nestjs/common';
import { AuthMiddleware } from '../user_database/auth.middleware'
import { ChatRoom } from './ChatRoom.entity';
import { Param } from '@nestjs/common';
import { UsersService } from '../user_database/user.service';
import { RouterModule } from '@nestjs/core';

@Controller('room')
@UseInterceptors(AuthMiddleware)
export class ChatRoomControllerNew {
  constructor(private readonly ChatRoomService: ChatRoomService,
    private readonly UsersService: UsersService
    ) {}

  @Post('create-room')
  async create_room(@Req() request: any, @Body() data : any): Promise<any> {
    console.log("Create room!!!!");
    const new_ChatRoom = new ChatRoom();
    new_ChatRoom.name = data.name;
    new_ChatRoom.type = data.type;
    new_ChatRoom.password = data.password;
    new_ChatRoom.adm = data.adm;

    let chat = await this.ChatRoomService.create(new_ChatRoom);
    
    //Add a new user. 
    const user = await this.UsersService.findOne(request.user_id);

    const room = await this.ChatRoomService.findOne(chat.id);
  
    room.users = await this.ChatRoomService.findUsers(room.id);
  
    room.users.push(user);
    
    await this.ChatRoomService.save(room);
 
    //Add as owner.
    chat = await this.ChatRoomService.findOne(chat.id);
    chat.owner = user;
    await this.ChatRoomService.update(chat.id, chat);


    //Add as admin. 
    chat = await this.ChatRoomService.findOne(chat.id);
    chat.adminusers = await this.ChatRoomService.findAdminUsers(chat.id);
    console.log(chat.adminusers);
    chat.adminusers.push(user);

    await this.ChatRoomService.save(chat);
    return chat;

  }

  //Teria que ser feito umas validações aqui. 
  @Post('add-user-room/:id')
  async addUserToChatRoom(@Req() request: any, @Param() params: any, @Body() userToAdd: any): Promise<any> {
    try {
      const user = await this.UsersService.findOneByName(userToAdd.name);
      if (!user) {
        return {
          success: false,
          message: 'User not found',
        };
      }
  
      const room = await this.ChatRoomService.findOne(params.id);
      if (!room) {
        return {
          success: false,
          message: 'Chat room not found',
        };
      }
  
      room.users = await this.ChatRoomService.findUsers(room.id);
      if (room.users.some(u => u.id === user.id)) {
        return {
          success: false,
          message: 'User is already in the chat room',
        };
      }
  
      room.users.push(user);
      await this.ChatRoomService.save(room);
  
      return {
        success: true,
        message: 'User added to chat room successfully',
      };
    } catch (error) {
      console.error('Error adding user to chat room:', error);
      return {
        success: false,
        message: 'Failed to add user to chat room',
      };
    }
  }

  @Get('room-user-info/:id')
  async getChatRoomInfo(@Param('id') id: number): Promise<any> {
    try {
      const chatRoom = await this.ChatRoomService.findRoomUsers(id);
      
      console.log(chatRoom);

      return chatRoom[0];

    } catch (error) {
      console.error(error);
      throw new Error('Internal server error');
    }
  }
}

