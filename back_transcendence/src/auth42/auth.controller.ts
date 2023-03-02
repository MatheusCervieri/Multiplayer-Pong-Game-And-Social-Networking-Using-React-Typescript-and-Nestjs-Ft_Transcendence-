import { Body, Controller, Get, Header, Post, Req, Res, UseGuards } from '@nestjs/common';
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

  @Post('2fa')
  async TwoFa(@Req() req, @Res() res, @Body() data : any) 
  {
    try
    {
    const user = await this.userService.findOneByName(data.name);
    if (user)
    {
      if (user.TwofaCodeGenerated === true)
      {
        if (user.TwofaSecret === data.code)
        {
          //return a response with the token of the user. 
          const token = user.token;
          return token;
        }
        else
        {
          throw new Error("Invalid code");
        }
      }
      else
      {
        throw new Error("Code not generated");
      }
    }
  }
  catch (e)
  {
    return e;
  }
  }

  @Get('42/callback')
  @UseGuards(AuthGuard('42'))
  async fortyTwoLoginCallback(@Req() req, @Res() res) {
      //Verificar se o usuário existe no banco de dados, eu posso fazer isso usando o id da 42. 
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
          console.log(twofacode);
          user42.TwofaCodeGenerated = true;
          user42.TwofaSecret = twofacode;
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
    
  }

  create_JWT(user: User) : any
  {
      const secretKey = process.env.SECRET_KEY;
  
      const payload = { id: user.id, email: user.email };
  
      const token = jwt.sign(payload, secretKey);
  
      return (token);
  }


  
}