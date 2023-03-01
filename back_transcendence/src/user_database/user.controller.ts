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

  @Post('block')
  async blockUser(@Req() request: any, @Body() body: { userToBlockName: string }): Promise<void> {
    const blockingUser = await this.userService.findByIdWithBlocks(request.user_id);
    const userToBlock = await this.userService.findOneByName(body.userToBlockName);
    await this.userService.blockUser(blockingUser, userToBlock);
  }

  @Get('blocked-users')
  async getBlockedUsers(@Req() request: any): Promise<User[]> {
  const blockingUser = await this.userService.findByIdWithBlocks(request.user_id);
  return blockingUser.blocks;
  }
}