import { Body, Controller, Get, HttpCode, HttpStatus, Post, Req } from '@nestjs/common';
import { Request } from 'express';
import { UsersService } from './user.service';
import { UseInterceptors } from '@nestjs/common';
import { AuthMiddleware } from './auth.middleware';7
import {Param} from '@nestjs/common';
import { User } from './user.entity';

@Controller('userdata')
@UseInterceptors(AuthMiddleware)
export class UserController {
  constructor(private readonly userService: UsersService) {}

  @Get()
  async findOne(@Req() request: any): Promise<any> {
    const userId = request.user_id;
    return await this.userService.findOne(userId);
  }

  @Get('profile/:name')
  async findProfileByName(@Param() params: any, @Req() request: any): Promise<any> {
    console.log(params.name);
    const user = await this.userService.findOneByName(params.name);
    if (user)
    {
      const userprofile = {
        name: user.name,
        email: user.email,
      }
      return userprofile;
    }
    return "Invalid user";
  }


  @Get('userstatus')
  async getUserWhithTheirStatus(@Req() request: any): Promise<any> {
    //Return a array of the users with their stauts - online, offline, playing a game.
    return await this.userService.GetUsersAndStatus();
  }


  @Get('usersranking')
  async getUsersRanking(@Req() request: any): Promise<any> {
    //Return a array of the users with their stauts - online, offline, playing a game.
    return await this.userService.GetUsersRanking();
  }

  @Get('myprofile')
  async getMyProfile(@Req() request: any): Promise<any> {
    //Return a array of the users with their stauts - online, offline, playing a game.
    const user = await this.userService.findOne(request.user_id);
    console.log(user);
    if (user)
    {
      const users = await this.userService.GetUsersRanking();
      const userprofile = users.find((user) => user.id == request.user_id); 
      //return sucessufull message with userprofile 
      return userprofile;
    }
    else 
    {
      return "Invalid user";
    }
  }

  @Post('block')
  async blockUser(@Req() request: any, @Body() body: { userToBlockName: string }): Promise<void> {
    const blockingUser = await this.userService.findByIdWithBlocks(request.user_id);
    const userToBlock = await this.userService.findOneByName(body.userToBlockName);
    await this.userService.blockUser(blockingUser, userToBlock);
  }

  @Post('addfriend')
  async AddFriend(@Req() request: any, @Body() body: { userToAddName: string }): Promise<void> {
    const addingFriend = await this.userService.findByIdWithFriends(request.user_id);
    const userToAdd = await this.userService.findOneByName(body.userToAddName);
    await this.userService.AddFriend(addingFriend, userToAdd);
  }

  @Get('blocked-users')
  async getBlockedUsers(@Req() request: any): Promise<User[]> {
  const blockingUser = await this.userService.findByIdWithBlocks(request.user_id);
  return blockingUser.blocks;
  }

  @Get('friends')
  async getFriends(@Req() request: any): Promise<any[]> {
    return this.userService.GetFriendWithStatus(request.user_id);

  }


  @Get('enable-2fa')
  async Enable2fa(@Req() request: any): Promise<any> {
   
    try 
    {
      const user = await this.userService.findOne(request.user_id);
      if (user)
      {
      user.TwofaAactive = true;
      await this.userService.update(request.user_id, user);
      return "2FA enabled";
      }
      else
        throw "User not found";
    }
    catch (error)
    {
      return error;
    }
  }

  @Get('disable-2fa')
  async Disable2fa(@Req() request: any): Promise<any> {
    try 
    {
      const user = await this.userService.findOne(request.user_id);
      if (user)
      {
      user.TwofaAactive = false;
      await this.userService.update(request.user_id, user);
      return "2FA disable";
      }
      else
        throw "User not found";
    }
    catch (error)
    {
      return error;
    }
  }
}