import { Body, Controller, Get, Delete, HttpCode, HttpStatus, Post, Req, HttpException } from '@nestjs/common';
import { ChatRoomService } from './ChatRoom.service';
import { UseInterceptors } from '@nestjs/common';
import { AuthMiddleware } from '../user_database/auth.middleware'
import { ChatRoom } from './ChatRoom.entity';
import { Param } from '@nestjs/common';
import { UsersService } from '../user_database/user.service';
import { RouterModule } from '@nestjs/core';

@Controller('chatdata')
//@UseInterceptors(AuthMiddleware)
export class ChatRoomController {
  constructor(private readonly ChatRoomService: ChatRoomService,
    private readonly UsersService: UsersService
    ) {}

  private removeTokenAndPasswordFromChatRoom(room: any): any {
    const { token, password, ...rest } = room;
    return rest;
  }

  @Get('get-rooms')
  async findAllPublic(@Req() request: any): Promise<any> {
    const privateRooms = await this.ChatRoomService.findAllPrivate();
    const publicRooms = await this.ChatRoomService.findAllPublic();
    const protectedRooms = await this.ChatRoomService.findAllProtected();
    const rooms = privateRooms.concat(publicRooms, protectedRooms);
    const sanitizedRooms = rooms.map(r => this.removeTokenAndPasswordFromChatRoom(r));
    return sanitizedRooms;
  }

  @Get('get-room-created/:id')
  async CheckCreated(@Param() params: any): Promise<any> {
    const roomId = params.id;
    try {
      // Perform the necessary logic to check if the room with the given id is created
      const room = await this.ChatRoomService.findOne(roomId);
      if (room) {
        return { status: 200, message: 'Room is created' };
      } else {
        return { status: 404, message: 'Room is not found' };
      }
    } catch (error) {
      return { status: 500, message: 'An error occurred while checking for the room' };
    }
  }

  @Get('get-room/:id')
  async findOne(@Param() params: any): Promise<any> {
    const roomId = params.id;
    try {
      // Perform the necessary logic to check if the room with the given id is created
      const room = await this.ChatRoomService.findOne(roomId);
      if (room) {
        return { room: room };
      } else {
        return { status: 404, message: 'Room is not found' };
      }
    } catch (error) {
      return { status: 500, message: 'An error occurred while checking for the room' };
    }
  }

  @Get('get-dms/:user')
  async findDmsFromUser(@Param() params: any): Promise<any> {
    const username = decodeURIComponent(params.user);
    const user = await this.UsersService.findOneByName(username);
    const DmsRooms = await this.ChatRoomService.findDMsByUser(user);
    const sanitizedRooms = DmsRooms.map(r => this.removeTokenAndPasswordFromChatRoom(r));
    return sanitizedRooms;
  }

  @Get('get-dms2/:user')
  async findDms2FromUser(@Param() params: any): Promise<any> {
    const username = decodeURIComponent(params.user);
    const useroficial = await this.UsersService.findOneByName(username);
    const RoomsDMS = await this.ChatRoomService.findAllDmsWithUsers();
   
    const RoomsWithSpecificUser = RoomsDMS.filter(chatRoom => {
      return chatRoom.users.some(user => user.id === useroficial.id);
    });
    const sanitizedRooms = RoomsWithSpecificUser.map(r => this.removeTokenAndPasswordFromChatRoom(r));
    return sanitizedRooms;
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


@Post('create-room-dm')
  async create_room_dm(@Req() request: any, @Body() data : any): Promise<any> {
    const new_ChatRoom = new ChatRoom();
    new_ChatRoom.name = data.name;
    new_ChatRoom.type = data.type;
    new_ChatRoom.password = data.password;
    new_ChatRoom.adm = data.adm;
  
    const user = await this.UsersService.findOneByName(data.users[0]);
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    const user2 = await this.UsersService.findOneByName(data.users[1]);
    if (!user2) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    
    const dmroom = await this.ChatRoomService.create(new_ChatRoom);
    dmroom.users =  await this.ChatRoomService.findUsers(dmroom.id);
    dmroom.users.push(user);
    dmroom.users.push(user2);
    await this.ChatRoomService.save(dmroom);
    
    const sanitizedRoom = this.removeTokenAndPasswordFromChatRoom(dmroom);
    return sanitizedRoom;
  }

  @Post('add-user-room/:id')
  async AddUsersToChatRoom(@Param() params: any, @Body() data : any): Promise<any> {
    console.log("teste");
    const user = await this.UsersService.findOneByName(data.name);
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    const room = await this.ChatRoomService.findOne(params.id);
    room.users = await this.ChatRoomService.findUsers(room.id);
    room.users.push(user);
    
    await this.ChatRoomService.save(room);
    const sanitizedRoom = this.removeTokenAndPasswordFromChatRoom(room);
    return sanitizedRoom;
  }

  @Get('room-users/:id')
  async getRoomUsers(@Param() params: any): Promise<any> {
    const roomUsers = await this.ChatRoomService.getRoomUsers(params.id);
    return roomUsers.map(user => user.name);
  }
  
  @Delete('delete-rooms')
  async delete_all_rooms(@Req() request: any): Promise<any> {
  return await this.ChatRoomService.deleteAll();
  }
}

