import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Email } from './email.entity';
import { ChatGateway } from './chat/chat.gateway';


@Module({
  imports: [TypeOrmModule.forFeature([Email])],
  exports: [TypeOrmModule],
  providers: [ChatGateway],
})
export class EmailModule {}