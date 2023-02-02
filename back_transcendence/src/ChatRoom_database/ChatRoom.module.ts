import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import {ChatRoom} from './ChatRoom.entity';


@Module({
  imports: [TypeOrmModule.forFeature([ChatRoom])],
  exports: [TypeOrmModule],
})
export class ChatRoomModule {}