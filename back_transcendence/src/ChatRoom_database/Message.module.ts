import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import {Message} from './ChatRoom.entity';


@Module({
  imports: [TypeOrmModule.forFeature([Message])],
  exports: [TypeOrmModule],
})
export class MessageModule {}