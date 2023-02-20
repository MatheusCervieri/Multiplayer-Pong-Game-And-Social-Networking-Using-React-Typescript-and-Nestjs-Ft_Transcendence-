import { Controller, Post, Res, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ImageService } from './image.service';
import { MulterModule } from '@nestjs/platform-express';
import { Get } from '@nestjs/common';
import { Req } from '@nestjs/common';
import { AuthMiddleware } from 'src/user_database/auth.middleware';
import { diskStorage } from 'multer';
import { extname } from 'path';
import * as fs from 'fs';
import { join } from 'path';
import { readdirSync } from 'fs';

@Controller('image')
@UseInterceptors(AuthMiddleware)
export class ImageController {
  constructor(private readonly ImageService: ImageService) {}

  @Get('hello')
  async findOne(@Req() request: any): Promise<any> {
    return "Hello World";
  }

  @Post('upload')
  @UseInterceptors(FileInterceptor('image', {
    storage: diskStorage({
      dest: './uploads',
      filename: (req, file, cb) => {
        const uniqueSufix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const ext = extname(file.originalname);
        const filename = file.originalname + uniqueSufix + ext;
        cb(null, filename);
      },
    }
  ,)}))
  async uploadImage(@UploadedFile() file: any, @Req() request: any): Promise<string> {
    console.log(file);
    return file.filename;
  }

  @Get('all')
  getAllFiles(): string[] {
    const filesDir = join(__dirname, 'uploads');
    const files = readdirSync(filesDir);
    return files;
  }

}