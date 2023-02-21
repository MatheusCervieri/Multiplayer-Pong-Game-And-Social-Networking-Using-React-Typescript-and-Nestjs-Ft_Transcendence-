import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Game } from './Game.entity';


@Module({
  imports: [TypeOrmModule.forFeature([Game])],
  exports: [TypeOrmModule],
})
export class GameModule {}