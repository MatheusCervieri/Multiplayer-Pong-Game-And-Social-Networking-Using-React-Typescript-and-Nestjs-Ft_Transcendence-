import { Controller, Get, HttpCode, HttpStatus, Req } from '@nestjs/common';
import { UsersService } from './user.service';


@Controller('users')
export class UsersInformationController {
  constructor(private readonly userService: UsersService) {}

  @Get('names')
  async findOne(@Req() request: any): Promise<any> {
    const names = await this.userService.findAllNames();
    return names;
  }

}