import { Body, Controller, Get, Delete, HttpCode, HttpStatus, Post, Req, HttpException, ForbiddenException, InternalServerErrorException, NotFoundException, Inject } from '@nestjs/common';
import { ChatRoomService } from './ChatRoom.service';
import { UseInterceptors } from '@nestjs/common';
import { AuthMiddleware } from '../user_database/auth.middleware'
import { ChatRoom } from './ChatRoom.entity';
import { Param } from '@nestjs/common';
import { UsersService } from '../user_database/user.service';
import { RouterModule } from '@nestjs/core';
import { ChatGateway } from 'src/chat/chat.gateway';
import * as bcrypt from 'bcrypt';

@Controller('room')
@UseInterceptors(AuthMiddleware)
export class ChatRoomControllerNew {
  constructor(
    private readonly ChatRoomService: ChatRoomService,
    private readonly UsersService: UsersService,
    private readonly ChatGateway: ChatGateway
    ) {}

  @Post('create-room')
  async create_room(@Req() request: any, @Body() data : any): Promise<any> {
 
    try
    {
    const new_ChatRoom = new ChatRoom();
    new_ChatRoom.name = data.name;
    new_ChatRoom.type = data.type;
    new_ChatRoom.password = await this.ChatRoomService.hashPassword(data.password);
    new_ChatRoom.adm = data.adm;

    let chat = await this.ChatRoomService.create(new_ChatRoom);

    // Check if chat exists
    if (!chat) {
      throw new NotFoundException('Chat not found');
    }

    // Add a new user
    const user = await this.UsersService.findOne(request.user_id);

    // Check if user exists
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const room = await this.ChatRoomService.findOne(chat.id);

    // Check if room exists
    if (!room) {
      throw new NotFoundException('Room not found');
    }

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
    chat.adminusers.push(user);

    await this.ChatRoomService.save(chat);
    return chat;
    }
    catch (e) {
      return e;
    }

  }

  //Teria que ser feito umas validações aqui. 
  @Post('add-user-room/:id')
  async addUserToChatRoom(@Req() request: any, @Param() params: any, @Body() data: any): Promise<any> {
    try {
      const user = await this.UsersService.findOne(request.user_id);
      if (!user) {
        throw new NotFoundException('User(Request) Not Found!');
      }
      const roomId = params.id;
      const room = await this.ChatRoomService.findRoomWithJustUsers(roomId);
  
      // Check if the room exists
      if (!room) {
        throw new NotFoundException('Room not found');
      }
  
      // Check if the user is already in the room
      const isUserInRoom = room.users.some(u => u.name === data.name);
      if (isUserInRoom) {
        console.log('User is already in the room');
        return this.removeTokenAndPasswordFromChatRoom(room);
      }
  
      // Add the user to the room and save it
      const userToAdd = await this.UsersService.findOneByName(data.name);
  
      // Check if the user exists
      if (!userToAdd) {
        throw new NotFoundException('User not found');
      }
  
      room.users.push(userToAdd);
      await this.ChatRoomService.save(room);
  
      return this.removeTokenAndPasswordFromChatRoom(room);
    } catch (err) {
      throw new InternalServerErrorException(err.message);
    }
  }
  
  private removeTokenAndPasswordFromChatRoom(room: ChatRoom): ChatRoom {
    if (Array.isArray(room.users)) {
      room.users.forEach(u => {
        delete u.token;
        delete u.password;
      });
    } 
  
    if (room.owner) {
      delete room.owner.token;
      delete room.owner.password;
    }
  
    if (Array.isArray(room.adminusers)) {
      room.adminusers.forEach(u => {
        delete u.token;
        delete u.password;
      });
    }

    if (Array.isArray(room.bannedusers)) {
      room.bannedusers.forEach(u => {
        delete u.token;
        delete u.password;
      });
    }
    delete room.password;
    return room;
  }

  private removeTokenAndPasswordFromUsers(users: any[]): any[] {
    return users.map(u => {
      const { token, password, ...rest } = u;
      return rest;
    });
  }

  @Get('room-user-info/:id')
  async getChatRoomInfo(@Param('id') id: number): Promise<any> {
    try {
      const chatRoom = await this.ChatRoomService.findRoomUsers(id);
      
      console.log(chatRoom);

      const sanitizedChatRoom = this.removeTokenAndPasswordFromChatRoom(chatRoom[0]);

      return sanitizedChatRoom;

    } catch (error) {
      console.error(error);
      throw new Error('Internal server error');
    }
  }

  @Post('change-type/:id')
  async setRoomType(@Req() request: any, @Param('id') id: number, @Body() data: any): Promise<any> {
    // Get user using request.
    const user = await this.UsersService.findOne(request.user_id);
    if (!user)
      throw new Error("User not found");
    // Get room using id.
    const room = await this.ChatRoomService.findOwner(id);
    console.log(room);
    if (!room)
      throw new Error("Room not found");

    // Check if user is the owner of the room.
   
    if (room.owner.id !== user.id) {
      throw new ForbiddenException('You are not authorized to change the room type.');
    }

    // If yes, change the type.
    const updatedRoom = await this.ChatRoomService.updateRoomType(room.id, data.type, await this.ChatRoomService.hashPassword(data.password));

    const sanitizedRoom = this.removeTokenAndPasswordFromChatRoom(updatedRoom);

    return { message: 'Room type updated successfully.', data: sanitizedRoom };
  }

  @Post('leave-room/:id')
  async LeaveRoom(@Req() request: any, @Param('id') id: number, @Body() data: any): Promise<any> {
    // Get user using request.
    try{
    const user = await this.UsersService.findOne(request.user_id);
    if (!user)
      throw new Error("User not found");
    // Get room using id.
    const room = await this.ChatRoomService.findOwner(id);
    if (!room)
      throw new Error("Room not found");

    // Check if user is the owner of the room.
   
    if (room.owner.id !== user.id) {
      //Leave the room
      this.ChatRoomService.removeParticipant(room.id, user.id);
    }
    else
    {
      //Set a new owner to the room. 
      this.ChatRoomService.removeParticipant(room.id, user.id);
      this.ChatRoomService.setNewOwner(room);
      //Leave the room. 
    }

    const sanitizedRoom = this.removeTokenAndPasswordFromChatRoom(room);

    return { message: 'Leave the room!', data: sanitizedRoom };
  }catch (error)
  {
    console.log(error);
    return { message: error };

  }
  }

  @Post('make-admin-room/:id')
  async MakeAdmin(@Req() request: any, @Param('id') id: number, @Body() data: any): Promise<any> {
    try {
      const user = await this.UsersService.findOne(request.user_id);
      if (!user)
        throw new Error('User not found');

      // Get room using id.
      const room = await this.ChatRoomService.findOwner(id);
      if (!room)
        throw new Error('Room not found');

      // Check if user is the owner of the room.
      if (room.owner.id !== user.id) {
        throw new ForbiddenException('You are not authorized to change the room type.');
      }

      const userToMakeAdmin = await this.UsersService.findOneByName(data.name);
      if (!userToMakeAdmin)
        throw new Error('User to make admin not found');

      //Check if the user is in the room.
      const roomUsers = await this.ChatRoomService.findUsers(room.id);
      if (!roomUsers.some(u => u.id === userToMakeAdmin.id))
        throw new Error('User to make admin is not in the room');

      //Check if the user is admin.
      const roomAdmin = await this.ChatRoomService.findAdminUsers(room.id);
      if (roomAdmin.some(u => u.id === userToMakeAdmin.id))
        throw new Error('User to make admin is already admin');

      //If not, make them admin.
      room.adminusers = roomAdmin;
      room.adminusers.push(userToMakeAdmin);
      await this.ChatRoomService.save(room);

      const sanitizedRoom = this.removeTokenAndPasswordFromChatRoom(room);
      const data1 = { message: "update-room", roomid: room.id};
      this.ChatGateway.server.to(room.id.toString()).emit('update-room', data1);
      
      return { message: 'User is now admin!', data: sanitizedRoom };
    } catch (error) {
      console.log(error);
      return { message: error };
    }
  }
  
  @Post('remove-admin-room/:id')
  async RemoveAdmin(@Req() request: any, @Param('id') id: number, @Body() data: any): Promise<any> {
      try{
      const user = await this.UsersService.findOne(request.user_id);
      if (!user)
        throw new Error("User not found");
      // Get room using id.
      const room = await this.ChatRoomService.findOwner(id);
      if (!room)
        throw new Error("Room not found");
  
      // Check if user is the owner of the room.
      if (room.owner.id !== user.id) {
        throw new ForbiddenException('You are not authorized to change the room type.');
      }

      const userToRemoveAdmin = await this.UsersService.findOneByName(data.name);
      if (!userToRemoveAdmin)
        throw new Error("User to remove admin not found");
      //Check if the user is in the room.
      const roomUsers = await this.ChatRoomService.findUsers(room.id);
      if (!roomUsers.some(u => u.id === userToRemoveAdmin.id))
        throw new Error("User to remove admin is not in the room");
      //Check if the user is admin.
      const roomAdmin = await this.ChatRoomService.findAdminUsers(room.id);
      if (!roomAdmin.some(u => u.id === userToRemoveAdmin.id))
        throw new Error("User to remove admin is not admin");
      //Check if the user is owner
      if (room.owner.id === userToRemoveAdmin.id)
        throw new Error("User to remove admin is owner");
      
      //If it is, remove admin permission from him.
      room.adminusers = roomAdmin;
      room.adminusers = room.adminusers.filter(u => u.id !== userToRemoveAdmin.id);
      await this.ChatRoomService.save(room);
      const data1 = { message: "updateroom", roomid: room.id};
      console.log(room.id);
      this.ChatGateway.server.to(room.id.toString()).emit('update-room', data1);
      return { message: 'User is now admin!', data: this.removeTokenAndPasswordFromChatRoom(room) };
    }catch (error)
    {
      console.log(error);
      return { message: error };
    } 
   
  }

  @Get('get-i-blocked-room/:id')
  async GetBlocked(@Req() request: any, @Param('id') id: number, @Body() data: any): Promise<any> {
    // Get the room with the banned users using ID
    const room = await this.ChatRoomService.findRoomWithBlockedUsers(id);

    //Check if the user that made the request is banned.
    if (room.bannedusers.some(u => u.id === request.user_id)) {
      const sanitizedBannedUsers = this.removeTokenAndPasswordFromUsers(room.bannedusers);
      return { isbanned: true , data: sanitizedBannedUsers };
    }
    
    // Return the banned users
    const sanitizedBannedUsers = this.removeTokenAndPasswordFromUsers(room.bannedusers);
    return { isbanned: false , data: sanitizedBannedUsers };
  }

  @Post('block-user-room/:id')
  async BlockUser(@Req() request: any, @Param('id') id: number, @Body() data: any): Promise<any> {
   
    try{
      const user = await this.UsersService.findOne(request.user_id);
      if (!user)
        throw new Error("User not found");
      // Get room using id.
      const room = await this.ChatRoomService.findOwner(id);
      if (!room)
        throw new Error("Room not found");
  
      if (room.owner.id !== user.id) {
        const roomAdmin = await this.ChatRoomService.findAdminUsers(room.id);
        if (!roomAdmin.some(u => u.id === user.id))
          throw new ForbiddenException('You are not authorized to change the room type.');
      }

      const userToBlock = await this.UsersService.findOneByName(data.name);
      if (!userToBlock)
        throw new Error("User to block not found");
      //Check if the user is in the room.
      const roomUsers = await this.ChatRoomService.findUsers(room.id);
      if (!roomUsers.some(u => u.id === userToBlock.id))
        throw new Error("User to block is not in the room");
      //Check if the user is blocked.
      const roomBlocked = await this.ChatRoomService.findBlockedUsers(room.id);
      if (roomBlocked.some(u => u.id === userToBlock.id))
        throw new Error("User to block is already blocked");
      //Check if the user is owner
      if (room.owner.id === userToBlock.id)
        throw new Error("You can´t block the owner");
      
      const data1 = { message: "update-room", roomid: room.id};
      this.ChatGateway.server.to(room.id.toString()).emit('update-room', data1);
      //If not, block him. 
      room.bannedusers = roomBlocked;
      room.bannedusers.push(userToBlock);
      await this.ChatRoomService.save(room);
      const sanitizedRoom = this.removeTokenAndPasswordFromChatRoom(room);
      return { message: 'User is now blocked!', data: sanitizedRoom };
    }catch (error)
    {
      console.log(error);
      return { message: error };
    }
  }

  @Post('unblock-user-room/:id')
  async UnBlockUser(@Req() request: any, @Param('id') id: number, @Body() data: any): Promise<any> {
    //Get user making the request using request;  
    //Get room using id;
    //Check if user making the request is the owner of the room or if user is a admin.
    //Check if user to unblock is in the room.
    //Check if user to unblock is already blocked.
    //If yes, unblock him.
    //If not, throw error.
    try{
      const user = await this.UsersService.findOne(request.user_id);
      if (!user)
        throw new Error("User not found");
      // Get room using id.
      const room = await this.ChatRoomService.findOwner(id);
      if (!room)
        throw new Error("Room not found");
  
      // Check if user is the owner of the room or if user is a admin. If it is a admin or owner, he can block users.
      if (room.owner.id !== user.id) {
        const roomAdmin = await this.ChatRoomService.findAdminUsers(room.id);
        if (!roomAdmin.some(u => u.id === user.id))
          throw new ForbiddenException('You are not authorized to change the room type.');
      }

      const userToUnBlock = await this.UsersService.findOneByName(data.name);
      if (!userToUnBlock)
        throw new Error("User to unblock not found");
      //Check if the user is in the room.
      const roomUsers = await this.ChatRoomService.findUsers(room.id);
      if (!roomUsers.some(u => u.id === userToUnBlock.id))
        throw new Error("User to unblock is not in the room");
      //Check if the user is blocked.
      const roomBlocked = await this.ChatRoomService.findBlockedUsers(room.id);
      if (!roomBlocked.some(u => u.id === userToUnBlock.id))
        throw new Error("User to unblock is not blocked");
      //Check if the user is owner
      if (room.owner.id === userToUnBlock.id)
        throw new Error("You can´t unblock the owner");

      const data1 = { message: "update-room", roomid: room.id};
      this.ChatGateway.server.to(room.id.toString()).emit('update-room', data1);
      //If yes, unblock him.
      room.bannedusers = roomBlocked;
      room.bannedusers = room.bannedusers.filter(u => u.id !== userToUnBlock.id);
      await this.ChatRoomService.save(room);
      const sanitizedRoom = this.removeTokenAndPasswordFromChatRoom(room);
      return { message: 'User is now unblocked!', data: sanitizedRoom };
    }catch (error)
    {
      console.log(error);
  }
}

@Post('mute-user-room/:id')
async MuteUser(@Req() request: any, @Param('id') id: number, @Body() data: any): Promise<any> {
   //Get user making the request using request;  
    //Get room using id;
    //Check if user making the request is the owner of the room or if user is a admin.
    //Check if user to mute is in the room.
    //Check if user to mute is already muted.
    //If not, mute him.
    //If yes, throw error.
    try{
      const user = await this.UsersService.findOne(request.user_id);
      if (!user)
        throw new Error("User not found");
      // Get room using id.
      const room = await this.ChatRoomService.findOwner(id);
      if (!room)
        throw new Error("Room not found");
  
      // Check if user is the owner of the room or if user is a admin. If it is a admin or owner, he can block users.
      if (room.owner.id !== user.id) {
        const roomAdmin = await this.ChatRoomService.findAdminUsers(room.id);
        if (!roomAdmin.some(u => u.id === user.id))
          throw new ForbiddenException('You are not authorized to change the room type.');
      }

      const userToMute = await this.UsersService.findOneByName(data.name);
      if (!userToMute)
        throw new Error("User to mute not found");
      //Check if the user is in the room.
      const roomUsers = await this.ChatRoomService.findUsers(room.id);
      if (!roomUsers.some(u => u.id === userToMute.id))
        throw new Error("User to mute is not in the room");
      //Check if the user is muted.
      const roomMuted = await this.ChatRoomService.findMutedUsers(room.id);
      if (roomMuted.some(u => u.id === userToMute.id))
        throw new Error("User to mute is already muted");
      //Check if the user is owner
      if (room.owner.id === userToMute.id)
        throw new Error("You can´t mute the owner");


      const data1 = { message: "update-room", roomid: room.id};
      this.ChatGateway.server.to(room.id.toString()).emit('update-room', data1);
      //If not, mute him.
      room.mutedusers = roomMuted;
      room.mutedusers.push(userToMute);
      await this.ChatRoomService.save(room);
      const sanitizedRoom = this.removeTokenAndPasswordFromChatRoom(room);
      return { message: 'User is now muted!', data: sanitizedRoom };
    }catch (error)
    {
      console.log(error);
      return { message: error };
    }
}



@Post('unmute-user-room/:id')
async UnMuteUser(@Req() request: any, @Param('id') id: number, @Body() data: any): Promise<any> {
   //Get user making the request using request;  
    //Get room using id;
    //Check if user making the request is the owner of the room or if user is a admin.
    //Check if user to unmute is in the room.
    //Check if user to unmute is already muted.
    //If yes, mute him.
    //If yes, throw error.
    try{
      const user = await this.UsersService.findOne(request.user_id);
      if (!user)
        throw new Error("User not found");
      // Get room using id.
      const room = await this.ChatRoomService.findOwner(id);
      if (!room)
        throw new Error("Room not found");
  
      // Check if user is the owner of the room or if user is a admin. If it is a admin or owner, he can block users.
      if (room.owner.id !== user.id) {
        const roomAdmin = await this.ChatRoomService.findAdminUsers(room.id);
        if (!roomAdmin.some(u => u.id === user.id))
          throw new ForbiddenException('You are not authorized to change the room type.');
      }

      const userToUnMute = await this.UsersService.findOneByName(data.name);
      if (!userToUnMute)
        throw new Error("User to unmute not found");
      //Check if the user is in the room.
      const roomUsers = await this.ChatRoomService.findUsers(room.id);
      if (!roomUsers.some(u => u.id === userToUnMute.id))
        throw new Error("User to unmute is not in the room");
      //Check if the user is muted.
      const roomMuted = await this.ChatRoomService.findMutedUsers(room.id);
      if (!roomMuted.some(u => u.id === userToUnMute.id))
        throw new Error("User to unmute is not muted");
      //Check if the user is owner
      if (room.owner.id === userToUnMute.id)
        throw new Error("You can´t unmute the owner");

      const data1 = { message: "update-room", roomid: room.id};
      this.ChatGateway.server.to(room.id.toString()).emit('update-room', data1);
      //If yes, mute him.
      room.mutedusers = roomMuted;
      room.mutedusers = room.mutedusers.filter(u => u.id !== userToUnMute.id);
      await this.ChatRoomService.save(room);
      const sanitizedRoom = this.removeTokenAndPasswordFromChatRoom(room);
      return { message: 'User is now unmuted!', data: sanitizedRoom };
    }catch (error)
    {
      console.log(error);
      return { message: error };
    }
    
}

@Get('users-and-status/:id')
async GetRoomUsersStatus(@Req() request: any, @Param('id') id: number): Promise<any> {
    //Return a list of users in the room with a status array that shows: if the users is blocked, if the users is the admin, if the user is the owner, if the user is muted.
    
    try{
      const user = await this.UsersService.findOne(request.user_id);
      if (!user)
        throw new Error("User not found");
      // Get room using id.
      const room = await this.ChatRoomService.findOwner(id);
      console.log(room);
      if (!room)
        throw new Error("Room not found");

      //Check if the user that make the request is in the room
      const roomUsers = await this.ChatRoomService.findUsers(room.id);
      if (!roomUsers.some(u => u.id === user.id))
        throw new Error("You are not in the room");

      const roomBlocked = await this.ChatRoomService.findBlockedUsers(room.id);
      const roomMuted = await this.ChatRoomService.findMutedUsers(room.id);
      const roomAdmin = await this.ChatRoomService.findAdminUsers(room.id);

      const users = roomUsers.map(u => {
        let isBlocked = false;
        let isMuted = false;
        let isAdmin = false;
        let isOwner = false;
        if (roomBlocked.some(bu => bu.id === u.id))
          isBlocked = true;
        if (roomMuted.some(mu => mu.id === u.id))
          isMuted = true;
        if (roomAdmin.some(au => au.id === u.id))
          isAdmin = true;
        if (room.owner.id === u.id)
          isOwner = true;

        const user = { 
          name: u.name,
          email: u.email,
          id: u.id,
          status: { isBlocked, isMuted, isAdmin, isOwner }
        };
        
        return user;
      })
      const sanitizedRoom = this.removeTokenAndPasswordFromChatRoom(room);
      const sanitizedUsers = this.removeTokenAndPasswordFromUsers(users);
      return { message: 'Users and their status in the room', data: {sanitizedRoom, sanitizedUsers} };
    }catch (error)
    {
      console.log(error);
      return { message: error };
    }
}

@Get('myprivillegesatrroom/:id')
async MyPrivllegesatroom(@Req() request: any, @Param('id') id: number): Promise<any> {
  //Return if the user that make the request is the owner or admin in the room. 
  try{
    const user = await this.UsersService.findOne(request.user_id);
    if (!user)
      throw new Error("User not found");
    // Get room using id.
    const room = await this.ChatRoomService.findOwner(id);
    if (!room)
      throw new Error("Room not found");

    //Check if the user that make the request is in the room
    const roomUsers = await this.ChatRoomService.findUsers(room.id);
    if (!roomUsers.some(u => u.id === user.id))
      throw new Error("You are not in the room");

    const roomBlocked = await this.ChatRoomService.findBlockedUsers(room.id);
    const roomMuted = await this.ChatRoomService.findMutedUsers(room.id);
    const roomAdmin = await this.ChatRoomService.findAdminUsers(room.id);

    let isBlocked = false;
    let isMuted = false;
    let isAdmin = false;
    let isOwner = false;
    if (roomBlocked.some(bu => bu.id === user.id))
      isBlocked = true;
    if (roomMuted.some(mu => mu.id === user.id))
      isMuted = true;
    if (roomAdmin.some(au => au.id === user.id))
      isAdmin = true;
    if (room.owner.id === user.id)
      isOwner = true;

    const name = user.name;
    const status = { name ,isBlocked, isMuted, isAdmin, isOwner }
    
    return { message: 'Your status in the room', status };
  }catch (error)
  {
    console.log(error);
    return { message: error };
  }
}


@Post('checkpassword/:id')
async CheckPassword(@Req() request: any, @Param('id') id: number, @Body() data: {password : string}): Promise<any> {
  try{
    const user = await this.UsersService.findOne(request.user_id);
    if (!user)
      throw new Error("User not found");
    // Get room using id.
    const room = await this.ChatRoomService.findOne(id);
    if (!room)
      throw new Error("Room not found");


    const isPasswordCorrect = await bcrypt.compare(data.password, room.password);
    if (!isPasswordCorrect)
      throw new Error("Password is incorrect");

    return { message: 'Password is correct', data: {isPasswordCorrect} };
}
catch (error)
{
  console.log(error);
  return { message: error };
}
}
}
