import { Controller, Get, Header, Req, Res, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { FortyTwoStrategy } from './fortytwo.strategy';
import { UsersService } from '../user_database/user.service';
import { User } from '../user_database/user.entity';
import * as jwt from 'jsonwebtoken';
import { create } from 'domain';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly fortyTwoStrategy: FortyTwoStrategy,
    private readonly userService: UsersService
    ) {}

  @Get('42')
  @UseGuards(AuthGuard('42'))
  async fortyTwoLogin() {}

  @Get('42/callback')
  @UseGuards(AuthGuard('42'))
  async fortyTwoLoginCallback(@Req() req, @Res() res) {
      //Verificar se o usuário existe no banco de dados, eu posso fazer isso usando o id da 42. 
      const user42 = await this.userService.findOneBy42Id(req.user.id);
      if (user42)
      {
        const token = user42.token;
        console.log(token);
        res.cookie('loginToken',token);
        const frontendUrl = `http://localhost:3000/auth`;
        res.redirect(frontendUrl);
      }
      else 
      {
        //Se não existir, criar um usuário no banco de dados com os dados que vieram da 42. 
        const user = new User();
        user.email = req.user.email;
        user.name = req.user.name;
        user.FortytwoId = req.user.id; 
        const databaseuser = await this.userService.create(user);
        const token = this.create_JWT(databaseuser);
        databaseuser.token = token;
        await this.userService.update(databaseuser.id, databaseuser);
        //encoding the token
        const base64Url = token.split('.').map(str => {
          return Buffer.from(str, 'base64').toString('base64url');
        }).join('.');
        const frontendUrl = `http://localhost:3000/auth?${new URLSearchParams({token: base64Url, newUser: 'true'})}`;
        res.redirect(frontendUrl);
      }

      //Se existir, fazer o login do usuário. Preciso pegar o token, encodificar o token e passar através da url para o front mandando para o dashboard.
      //Se não existir, envio para a tela de criação de usuário. Preciso pegar o token, encodificar o token e passar através da url para o front mandando para a tela de criação de usuário.
    const data = {
      message: 'Successfully authenticated with 42!',
      user: req.user.name,
    };

    
  }

  create_JWT(user: User) : any
  {
      const secretKey = process.env.SECRET_KEY;
  
      const payload = { id: user.id, email: user.email };
  
      const token = jwt.sign(payload, secretKey);
  
      return (token);
  }


  
}