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
      await this.userService.updateName(userId, data.name);
      return { message: 'Name updated successfully', status: HttpStatus.OK };
  }
}