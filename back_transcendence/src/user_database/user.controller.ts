import { Controller, Get, HttpCode, HttpStatus, Req } from '@nestjs/common';
import { Request } from 'express';
import { UsersService } from './user.service';
import { UseInterceptors } from '@nestjs/common';
import { AuthMiddleware } from './auth.middleware';

@Controller('userdata')
@UseInterceptors(AuthMiddleware)
export class UserController {
  constructor(private readonly userService: UsersService) {}

  @Get()
  async findOne(@Req() request: any): Promise<any> {
    const userId = request.user_id;
    return await this.userService.findOne(userId);
  }

}