import { Controller, Post, Body, Req, HttpStatus } from '@nestjs/common';
import { UsersService } from '../user_database/user.service';
import { AuthMiddleware } from '../user_database/auth.middleware';
import { UseInterceptors } from '@nestjs/common';

@Controller('set-name')
@UseInterceptors(AuthMiddleware)
export class NameSetController {
  constructor(private readonly userService: UsersService) {}

  @Post()
  async update(@Req() req: any, @Body() data: { name: string }) {

      const userId = req.user_id;
      //check in the database if the name is unique. If it not unique, return a error to the frontend.
      const user = await this.userService.findOneByName(data.name);
      if (user) {
          return { message: 'Name already taken', status: HttpStatus.BAD_REQUEST };
      }

      await this.userService.updateName(userId, data.name);
      return { message: 'Name updated successfully', status: HttpStatus.OK };
  }
}