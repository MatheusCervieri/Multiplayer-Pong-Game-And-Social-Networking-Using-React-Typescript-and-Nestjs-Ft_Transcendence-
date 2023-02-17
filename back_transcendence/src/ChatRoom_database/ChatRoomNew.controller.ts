import { Body, Controller, Get, Delete, HttpCode, HttpStatus, Post, Req, HttpException, ForbiddenException } from '@nestjs/common';
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
    const updatedRoom = await this.ChatRoomService.updateRoomType(room.id, data.type, data.password);

    return { message: 'Room type updated successfully.', data: updatedRoom };
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
      return { message: 'Leave the room!', data: room };
  }catch (error)
  {
    console.log(error);
    return { message: error };

  }
  }

  @Post('make-admin-room/:id')
  async MakeAdmin(@Req() request: any, @Param('id') id: number, @Body() data: any): Promise<any> {
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

      const userToMakeAdmin = await this.UsersService.findOneByName(data.name);
      if (!userToMakeAdmin)
        throw new Error("User to make admin not found");
      //Check if the user is in the room.
      const roomUsers = await this.ChatRoomService.findUsers(room.id);
      if (!roomUsers.some(u => u.id === userToMakeAdmin.id))
        throw new Error("User to make admin is not in the room");
      //Check if the user is admin.
      const roomAdmin = await this.ChatRoomService.findAdminUsers(room.id);
      if (roomAdmin.some(u => u.id === userToMakeAdmin.id))
        throw new Error("User to make admin is already admin");
      //If not, make him admin. 
      room.adminusers = roomAdmin;
      room.adminusers.push(userToMakeAdmin);
      await this.ChatRoomService.save(room);
      return { message: 'User is now admin!', data: room };
    }catch (error)
    {
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
      return { message: 'User is now admin!', data: room };
    }catch (error)
    {
      console.log(error);
      return { message: error };
    } 
   
  }

  @Post('block-user-room/:id')
  async BlockUser(@Req() request: any, @Param('id') id: number, @Body() data: any): Promise<any> {
    //Get user making the request using request;  
    //Get room using id;
    //Check if user making the request is the owner of the room or if user is a admin.
    //Check if user to block is in the room.
    //Check if user to block is already blocked.
    //If not, block him.
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

      //If not, block him. 
      room.bannedusers = roomBlocked;
      room.bannedusers.push(userToBlock);
      await this.ChatRoomService.save(room);
      return { message: 'User is now blocked!', data: room };
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

      //If yes, unblock him.
      room.bannedusers = roomBlocked;
      room.bannedusers = room.bannedusers.filter(u => u.id !== userToUnBlock.id);
      await this.ChatRoomService.save(room);
      return { message: 'User is now unblocked!', data: room };
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

      //If not, mute him.
      room.mutedusers = roomMuted;
      room.mutedusers.push(userToMute);
      await this.ChatRoomService.save(room);
      return { message: 'User is now muted!', data: room };
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

      //If yes, mute him.
      room.mutedusers = roomMuted;
      room.mutedusers = room.mutedusers.filter(u => u.id !== userToUnMute.id);
      await this.ChatRoomService.save(room);
      return { message: 'User is now unmuted!', data: room };
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
      return { message: 'Users and their status in the room', data: {room, users} };
    }catch (error)
    {
      console.log(error);
      return { message: error };
    }
}
}
