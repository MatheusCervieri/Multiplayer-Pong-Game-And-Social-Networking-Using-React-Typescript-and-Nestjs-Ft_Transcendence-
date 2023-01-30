import * as jwt from 'jsonwebtoken';
import { Controller, Post, Body, Req, HttpStatus } from '@nestjs/common';
import { UsersService } from '../user_database/user.service';
import { decode } from 'punycode';

@Controller('set-name')
export class NameSetController {
  constructor(private readonly userService: UsersService) {}

  @Post()
  async update(@Req() req: any, @Body() data: { name: string }) {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return { message: 'Access denied. No token provided.', status: HttpStatus.UNAUTHORIZED };
    }
    console.log(token);
    try {
      const decoded = jwt.verify(token, 'mysecretkey');
      console.log(decoded);
      const userId = decoded.id;
      console.log(decoded.id);
      await this.userService.updateName(userId, data.name);
      return { message: 'Name updated successfully', status: HttpStatus.OK };
    } catch (error) {
      return { message: 'Invalid token.', status: HttpStatus.BAD_REQUEST };
    }
  }
}