import { BadRequestException, Body, Controller, Get, HttpCode, HttpException, HttpStatus, Post, Req } from '@nestjs/common';
import { IsEmail } from 'class-validator';
import { Request } from 'express';
import { UsersService } from './user.service';
import { UseInterceptors } from '@nestjs/common';
import { AuthMiddleware } from './auth.middleware';7
import {Param} from '@nestjs/common';
import { User } from './user.entity';
import { validate } from 'class-validator';

@Controller('userdata')
@UseInterceptors(AuthMiddleware)
export class UserController {
  constructor(private readonly userService: UsersService) {}

  @Get()
  async findOne(@Req() request: any): Promise<any> {
    try {
      // Get the user object and exclude the token and password fields
      const userId = request.user_id;
      const user = await this.userService.findOne(userId);
      if (user) {
        delete user.token;
        delete user.password;
        return user;
      } else {
        // If user does not exist, return an error message
        return { error: 'Invalid user' };
      }
    } catch (error) {
      console.error(error);
      return { error: 'An error occurred while fetching the user' };
    }
  }

@Get('profile/:name')
async findProfileByName(@Param() params: any, @Req() request: any): Promise<any> {
  try {
    // Get the user profile and exclude the token and password fields
    const userName = params.name;
    const user = await this.userService.findOneByName(userName);
    if (user) {
      const users = await this.userService.GetUsersRanking();
      const userprofile = users.find((user) => user.id == request.user_id);
      delete userprofile.token;
      delete userprofile.password;
      return userprofile;
    }
    return { error: 'Invalid user' };
  } catch (error) {
    console.error(error);
    return { error: 'An error occurred while fetching the user profile' };
  }
}

@Get('userstatus')
async getUserWhithTheirStatus(@Req() request: any): Promise<any> {
  try {
    // Get the list of users and exclude the token and password fields from each user object
    const users = await this.userService.GetUsersAndStatus();
    const sanitizedUsers = users.map((user) => {
      delete user.token;
      delete user.password;
      return user;
    });
    return sanitizedUsers;
  } catch (error) {
    console.error(error);
    return { error: 'An error occurred while fetching the user statuses' };
  }
}

  @Get('usersranking')
  async getUsersRanking(@Req() request: any): Promise<any> {
    try {
      // Get the list of users and exclude the token and password fields from each user object
      const users = await this.userService.GetUsersRanking();
      const sanitizedUsers = users.map((user) => {
        delete user.token;
        delete user.password;
        return user;
      });
      return sanitizedUsers;
    } catch (error) {
      console.error(error);
      return { error: 'An error occurred while fetching the user rankings' };
    }
  }


  @Get('myprofile')
  async getMyProfile(@Req() request: any): Promise<any> {
    try {
      // Get the user profile based on the user ID in the request
      const user = await this.userService.findOne(request.user_id);

      // If user exists, return the profile with the token and password fields excluded
      if (user) {
        const users = await this.userService.GetUsersRanking();
        const userprofile = users.find((user) => user.id == request.user_id);
        delete userprofile.token;
        delete userprofile.password;
        return userprofile;
      } else {
        // If user does not exist, return an error message
        return { error: 'Invalid user' };
      }
    } catch (error) {
      console.error(error);
      return { error: 'An error occurred while fetching the user profile' };
    }
  }


    @Post('block')
    async blockUser(@Req() request: any, @Body() body: any): Promise<void> {
    try {
      // Validate the request data
      const validationErrors = await validate(body);
      if (validationErrors.length > 0) {
        throw new HttpException(validationErrors, HttpStatus.BAD_REQUEST);
      }

      // Block the user
      const blockingUser = await this.userService.findByIdWithBlocks(request.user_id);
      const userToBlock = await this.userService.findOneByName(body.userToBlockName);
      await this.userService.blockUser(blockingUser, userToBlock);
    } catch (error) {
      console.error(error);
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Post('addfriend')
  async AddFriend(@Req() request: any, @Body() body: any): Promise<void> {
    try {
      // Validate the request data
      const validationErrors = await validate(body);
      if (validationErrors.length > 0) {
        throw new HttpException(validationErrors, HttpStatus.BAD_REQUEST);
      }

      // Add the friend
      const addingFriend = await this.userService.findByIdWithFriends(request.user_id);
      const userToAdd = await this.userService.findOneByName(body.userToAddName);
      await this.userService.AddFriend(addingFriend, userToAdd);
    } catch (error) {
      console.error(error);
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get('blocked-users')
async getBlockedUsers(@Req() request: any): Promise<User[]> {
  try {
    const blockingUser = await this.userService.findByIdWithBlocks(request.user_id);
    const blockedUsers = blockingUser.blocks;
    const sanitizedBlockedUsers = blockedUsers.map((user) => {
      delete user.token;
      delete user.password;
      return user;
    });
    return sanitizedBlockedUsers;
  } catch (error) {
    console.error(error);
    throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
  }
}

@Get('friends')
async getFriends(@Req() request: any, @Body() body: any): Promise<any[]> {
  try {
    // Validate the request data
    const validationErrors = await validate(body);
    if (validationErrors.length > 0) {
      throw new HttpException(validationErrors, HttpStatus.BAD_REQUEST);
    }

    // Get the list of friends and exclude the token and password fields from each user object
    const friends = await this.userService.GetFriendWithStatus(request.user_id);
    const sanitizedFriends = friends.map((user) => {
      delete user.token;
      delete user.password;
      return user;
    });
    return sanitizedFriends;
  } catch (error) {
    console.error(error);
    throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
  }
}


@Post('enable-2fa')
async Enable2fa(@Req() request: any, @Body() data: any): Promise<any> {
  try {
    // Validate the request data
    const validationErrors = await validate(data);
    if (validationErrors.length > 0) {
      throw new HttpException(validationErrors, HttpStatus.BAD_REQUEST);
    }

    // Update the user to enable 2FA
    const user = await this.userService.findOne(request.user_id);
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    user.TwofaAactive = true;
    user.email = data.email;
    await this.userService.update(request.user_id, user);

    return { message: '2FA enabled' };
  } catch (error) {
    console.error(error);
    throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
  }
}

@Get('disable-2fa')
async Disable2fa(@Req() request: any): Promise<any> {
  try {
    const user = await this.userService.findOne(request.user_id);
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    user.TwofaAactive = false;
    await this.userService.update(request.user_id, user);

    return { message: '2FA disabled' };
  } catch (error) {
    console.error(error);
    throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
  }
}

  @Get('2fastatus')
  async Get2fa(@Req() request: any): Promise<any> {
    try {
      const user = await this.userService.findOne(request.user_id);
      if (!user) {
        throw new HttpException('User not found', HttpStatus.NOT_FOUND);
      }
  
      return user.TwofaAactive;
    } catch (error) {
      console.error(error);
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}