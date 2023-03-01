import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { FortyTwoStrategy } from './fortytwo.strategy';

@Module({
  imports: [PassportModule],
  providers: [FortyTwoStrategy],
})
export class AuthModule {}