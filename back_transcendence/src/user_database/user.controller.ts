import { Controller, Get, HttpCode, HttpStatus, Req } from '@nestjs/common';
import { Request } from 'express';
import { UsersService } from './user.service';
import { UseInterceptors } from '@nestjs/common';
import { AuthMiddleware } from './auth.middleware';7
import {Param} from '@nestjs/common';

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
    const user = await this.userService.findOneByName(params.name);
    const userprofile = {
      name: user.name,
      email: user.email,
    }
    return userprofile;
  }

}