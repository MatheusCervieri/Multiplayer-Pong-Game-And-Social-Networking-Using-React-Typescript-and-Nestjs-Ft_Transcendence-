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

@Controller('image')
@UseInterceptors(AuthMiddleware)
export class ImageController {
  constructor(
    private readonly ImageService: ImageService,
    private readonly userService: UsersService) {}

  @Get('hello')
  async findOne(@Req() request: any): Promise<any> {
    return "Hello World";
  }

  @Post('upload')
  @UseInterceptors(FileInterceptor('image', {
    storage: diskStorage({
      destination: './uploads',
      filename: (req, file, cb) => {
        const uniqueSufix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const ext = extname(file.originalname);
        const filename = file.originalname + uniqueSufix + ext;
        cb(null, filename);
      },
    }
  ,)}))

  async uploadImage(@UploadedFile() file: any, @Req() request: any): Promise<string> {
    //Check the user id using request.
    //Check if the user has an image already.
    //If the user has an image already, delete the old image.
    //Save the new image.
    //Save the image information in a new image entity.
    //Atribute the image entity to the user. 

    const userId = request.user_id;

    //Create a new image entity;

    const newImage = new Image();
    newImage.filename = file.filename;
    newImage.mimetype = file.mimetype;
    newImage.path = file.path;
    newImage.size = file.size;

    const user = await this.userService.findWithImage(userId);
    if (user.image) {
      const oldImage = user.image;
      const oldImagePath = oldImage.path;
      //NEED TO DO: Delete the old image fron the server and from the database.

    }
    newImage.user = user;
    await this.ImageService.create(newImage);
    console.log(file);
    return file.filename;
  }

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