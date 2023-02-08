import { Body, Controller, Get, Delete, HttpCode, HttpStatus, Post, Req } from '@nestjs/common';
import { ChatRoomService } from './ChatRoom.service';
import { UseInterceptors } from '@nestjs/common';
import { AuthMiddleware } from '../user_database/auth.middleware'
import { ChatRoom } from './ChatRoom.entity';
import { Param } from '@nestjs/common';
import { UsersService } from '../user_database/user.service';

@Controller('chatdata')
//@UseInterceptors(AuthMiddleware)
export class ChatRoomController {
  constructor(private readonly ChatRoomService: ChatRoomService,
    private readonly UsersService: UsersService
    ) {}

  @Get('get-rooms')
  async findAll(@Req() request: any): Promise<any> {
    return await this.ChatRoomService.findAll();
  }

  @Get('get-room/:id')
  async findOne(@Param() params: any): Promise<any> {
    return await this.ChatRoomService.findOne(params.id);
  }

  @Get('get-dms/:user')
  async findDmsFromUser(@Param() params: any): Promise<any> {
    const username = decodeURIComponent(params.user);
    const user = await this.UsersService.findOneByName(username);
    const DmsRooms = await this.ChatRoomService.findDMsByUser(user);
    console.log(DmsRooms);
    return DmsRooms;
  }

  @Get('get-dms2/:user')
  async findDms2FromUser(@Param() params: any): Promise<any> {
    const username = decodeURIComponent(params.user);
    const user = await this.UsersService.findOneByName(username);
    const RoomsDMS = await this.ChatRoomService.findAllDmsWithUsers();
    const RoomsWithSpecificUser = RoomsDMS.filter(roomDMS => {
      return roomDMS.users.some(user => user === user);
    });
    console.log(RoomsWithSpecificUser);
    return RoomsWithSpecificUser;
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

  @Post('add-user-room/:id')
  async AddUsersToChatRoom(@Param() params: any, @Body() data : any): Promise<any> {
    console.log("AddUsers to Chat Room function\n");
    console.log(data);
    const user = await this.UsersService.findOneByName(data.name);
    const room = await this.ChatRoomService.findOne(params.id);
    console.log(user);
    console.log("Room object:", room);
    room.users = await this.ChatRoomService.findUsers(room.id);
    console.log("Room users", room.users);
    room.users.push(user);
    console.log("New room users", room.users);
    return await this.ChatRoomService.save(room);
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

