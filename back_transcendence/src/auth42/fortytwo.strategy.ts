import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-42';

@Injectable()
export class FortyTwoStrategy extends PassportStrategy(Strategy, '42') {
  constructor() {
    super({
      clientID: process.env.FORTYTWO_CLIENT_ID ,
      clientSecret: process.env.FORTYTWO_CLIENT_SECRET,
      callbackURL: process.env.FORTYTWO_CALLBACK_URL,
      scope: 'public',
    });
  }

  async validate(accessToken: string, refreshToken: string, profile: any) {
    const { id, email, login, displayname } = profile._json;
    console.log("Email", email);
    return {
      id,
      email,
      username: login,
      name: displayname,
      accessToken,
    };
  }
}