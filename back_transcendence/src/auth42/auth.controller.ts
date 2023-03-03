import { Body, Controller, Get, Header, Post, Req, Res, UseGuards , HttpException, HttpStatus} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { FortyTwoStrategy } from './fortytwo.strategy';
import { UsersService } from '../user_database/user.service';
import { User } from '../user_database/user.entity';
import * as jwt from 'jsonwebtoken';
import { create } from 'domain';
import nodemailer from 'nodemailer';
import {Image} from '../image/image.entity';
import { ImageService } from 'src/image/image.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly fortyTwoStrategy: FortyTwoStrategy,
    private readonly imageService: ImageService,
    private readonly userService: UsersService,
    ) {}

  @Get('42')
  @UseGuards(AuthGuard('42'))
  async fortyTwoLogin() {}

  @Post('2fa')
  async TwoFa(@Req() req, @Res() res, @Body() data: any) {
    try {
      console.log(data.name);
      const user = await this.userService.findOneByName(data.name);
      console.log(user);
      console.log("Code generated", user.TwofaCodeGenerated);
      console.log(user.TwofaSecret, data.code);
      if (user) {
        if (user.TwofaCodeGenerated === true) {
          console.log(user.TwofaSecret, data.code);
          if (user.TwofaSecret === data.code) {
            // Return a response with the token of the user.
            const token = user.token;
            const data = { 
              token : token,
            }
            //return the response with the token
            res.status(HttpStatus.OK).json(data);
          } else {
            throw new HttpException('Invalid code', HttpStatus.BAD_REQUEST);
          }
        } else {
          throw new HttpException('Code not generated', HttpStatus.BAD_REQUEST);
        }
      }
    } catch (e) {
      console.log(e);
      throw new HttpException(e.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Get('42/callback')
  @UseGuards(AuthGuard('42'))
  async fortyTwoLoginCallback(@Req() req, @Res() res) {
      //Verificar se o usuário existe no banco de dados, eu posso fazer isso usando o id da 42. 
      //Remove user for make tests
      
      const user = await this.userService.findOneBy42Id(req.user.id);
      await this.userService.remove(user.id);
      const user42 = await this.userService.findOneBy42Id(req.user.id);
      if (user42)
      {
        //Logou
        const token = user42.token;
        console.log(token);
        
        if(user42.TwofaAactive === true)
        {
          //Redirect to two factor authentication.
          const frontendUrl = `http://localhost:3000/twofa?${new URLSearchParams({name: user42.name})}`;
          const twofacode = Math.floor(100000 + Math.random() * 900000);
          user42.TwofaCodeGenerated = true;
          user42.TwofaSecret = twofacode.toString();
          //send the code to email.
          await this.userService.update(user42.id, user42);
          res.redirect(frontendUrl);
        }
        else
        {
          res.cookie('loginToken',token);
          const frontendUrl = `http://localhost:3000/auth`;
          res.redirect(frontendUrl);
        }
      }
      else 
      {
        //Criar usuário
        const user = new User();
        user.email = req.user.email;
        //user.name = req.user.name;
        user.FortytwoId = req.user.id; 
        const databaseuser = await this.userService.create(user);
        const token = this.create_JWT(databaseuser);
        databaseuser.token = token;
        const updatedUser = await this.userService.update(databaseuser.id, databaseuser);

        //set a default image to the new user:

        const fs = require('fs');
        const mime = require('mime');
        const defaultImagePath = '/uploads/default.jpg';
        const image = new Image();
        image.filename = 'default.jpg';
        image.mimetype = mime.getType(defaultImagePath);
        image.path = defaultImagePath;
        image.size = fs.statSync(defaultImagePath).size;
        const imagedatabase = await this.imageService.create(image);
        const userWithImage = await this.userService.findWithImage(databaseuser.id);
        userWithImage.image = imagedatabase;
        await this.userService.update(databaseuser.id, userWithImage);
        console.log("USER ID TO GET IMAGE ", databaseuser.id);

        //encoding the token
        res.cookie('loginToken',token);
        const frontendUrl = `http://localhost:3000/authregister`;
        res.redirect(frontendUrl);
      }
    
  }

  create_JWT(user: User) : any
  {
      const secretKey = process.env.SECRET_KEY;
  
      const payload = { id: user.id, email: user.email };
  
      const token = jwt.sign(payload, secretKey);
  
      return (token);
  }

  



  
}