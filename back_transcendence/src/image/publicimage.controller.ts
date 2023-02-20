import { Body, Controller, Param, Post, Res, UploadedFile, UseInterceptors } from '@nestjs/common';
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
import { UsersService } from 'src/user_database/user.service';
import {Image} from './image.entity';
import express, { Request, Response } from "express";

@Controller('publicimage')
export class PublicImageController {
  constructor(
    private readonly ImageService: ImageService,
    private readonly userService: UsersService) {}

  @Get('profileimage/:id')
  async GetProfileImage(@Param('id') id: number, @Req() request : any, @Res() res: Response): Promise<any> {
    const user = await this.userService.findWithImage(id);
    if (!user || !user.image) {
      // Handle user not found or user without an image
      return res.status(404).send();
    }
    const image: Image = user.image;
    res.set({
      'Content-Type': image.mimetype,
      'Content-Length': image.size.toString(),
    });
    return res.sendFile(image.path, { root: '.' });
  }

}