import { Body, Controller, Get, Delete, HttpCode, HttpStatus, Post, Req, HttpException, ForbiddenException, Inject, Param } from '@nestjs/common';
import { UseInterceptors } from '@nestjs/common';
import { AuthMiddleware } from '../user_database/auth.middleware'
import { UsersService } from '../user_database/user.service';
import { ChatGateway } from 'src/chat/chat.gateway';
import { GamesServices } from './Games.service';

@Controller('games')
@UseInterceptors(AuthMiddleware)
export class GamesController {
  constructor(
    private readonly UsersService: UsersService,
    private readonly GameService: GamesServices,
    private readonly ChatGateway: ChatGateway
    ) {}

    

  @Get('hello-world')
  async hello(@Req() request: any, @Body() data : any): Promise<any> {
    return "Hello World";
  }

  @Get('information/:id')
  async getGameInformation(@Req() request: any, @Body() data : any): Promise<any> {
    try
    {
    const game = await this.GameService.findGame(request.params.id);
    if(game === undefined) {
      throw new ForbiddenException("Game not found");
    }
    return game;
    }
    catch (e) {
      return e;
    }
  }

  @Get('running')
  async getRunningGames(@Req() request: any, @Body() data : any): Promise<any> {
    try
    {
    const games = await this.GameService.getRunningGames();
    return games;
    }
    catch (e) {
      return e;
    }
  }

  @Get('history/:name')
  async getMatchHistory(@Req() request: any,@Param('name') name: string, @Body() data : any): Promise<any> {
    const decodedname = decodeURIComponent(name);
    
    try
    {
      const user = await this.UsersService.findOneByName(decodedname);
      
      const history = await this.GameService.getGamesByPlayerId(user.id);
    return history;
    }
    catch (e) {
      return e;
    }
  }
 
}
