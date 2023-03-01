import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { FortyTwoStrategy } from './fortytwo.strategy';

@Controller('auth')
export class AuthController {
  constructor(private readonly fortyTwoStrategy: FortyTwoStrategy) {}

  @Get('42')
  @UseGuards(AuthGuard('42'))
  async fortyTwoLogin() {}

  @Get('42/callback')
  @UseGuards(AuthGuard('42'))
  async fortyTwoLoginCallback(@Req() req) {
    return {
      message: 'Successfully authenticated with 42!',
      user: req.user,
    };
  }
}