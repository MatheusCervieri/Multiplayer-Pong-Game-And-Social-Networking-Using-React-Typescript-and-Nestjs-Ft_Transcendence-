import { Body, Controller, Get, Delete, HttpCode, HttpStatus, Post, Req, HttpException, ForbiddenException, Inject } from '@nestjs/common';
import { UseInterceptors } from '@nestjs/common';
import { AuthMiddleware } from '../user_database/auth.middleware'
import { UsersService } from '../user_database/user.service';
import { ChatGateway } from 'src/chat/chat.gateway';

@Controller('games')
@UseInterceptors(AuthMiddleware)
export class GamesController {
  constructor(
    private readonly UsersService: UsersService,
    private readonly ChatGateway: ChatGateway
    ) {}

  @Get('hello-world')
  async hello(@Req() request: any, @Body() data : any): Promise<any> {
    return "Hello World";
  }

}
