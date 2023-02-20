import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Image } from './image.entity';


@Module({
  imports: [TypeOrmModule.forFeature([Image]), MulterModule.register({dest: './uploads'})],
  exports: [TypeOrmModule],
})
export class ImageModule {}