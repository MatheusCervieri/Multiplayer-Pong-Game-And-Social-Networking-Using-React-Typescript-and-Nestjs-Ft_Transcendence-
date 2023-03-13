import { BadRequestException, Body, Controller, Param, Post, Res, UploadedFile, UseInterceptors } from '@nestjs/common';
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
import { unlinkSync } from 'fs';

@Controller('image')
@UseInterceptors(AuthMiddleware)
export class ImageController {
  constructor(
    private readonly ImageService: ImageService,
    private readonly userService: UsersService) {}

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
  async uploadImage(@UploadedFile() file: any, @Req() request: any): Promise<any> {

    const userId = request.user_id;

    try
    {
    // Check if user exists
    const user = await this.userService.findWithImage(userId);
    if (!user) {
      //Remove the file 
      unlinkSync(file.path);
      throw new BadRequestException({ message: 'User not found', statusCode: 400 });
    }

    if (!file.mimetype.startsWith('image/')) {
      unlinkSync(file.path);
      throw new BadRequestException({ message: 'File is not an image', statusCode: 400 });
    }

    // Check if the file size is smaller than 15MB
    if (file.size > 15 * 1024 * 1024) {
      unlinkSync(file.path);
      throw new BadRequestException({ message: 'File size exceeds 15MB', statusCode: 400 });
    }

    //Create a new image entity;

    const newImage = new Image();
    newImage.filename = file.filename;
    newImage.mimetype = file.mimetype;
    newImage.path = file.path;
    newImage.size = file.size;


    if (user.image) {
      const oldImage = user.image;
      const oldImagePath = oldImage.path;
      //NEED TO DO: Delete the old image fron the server and from the database if it is different from the default image

    }
    newImage.user = user;
    const image = await this.ImageService.create(newImage);
    
    
    return ({message: "Image uploaded successfully", statusCode: 200, image: image});
    }
    catch (err) {
      
      return ({ message: err.message, statusCode: err.statusCode, error: err });
    }
  }
  @Get('profileimage/:id')
  async GetProfileImage(@Param('id') id: number, @Req() request : any, @Res() res: Response): Promise<any> {
    if (!id || isNaN(id)) {
      // Handle invalid ID
      return res.status(400).send('Invalid ID');
    }
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