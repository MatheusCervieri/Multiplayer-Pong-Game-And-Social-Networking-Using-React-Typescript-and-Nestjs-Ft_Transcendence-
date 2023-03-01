import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cors from 'cors';
import * as dotenv from 'dotenv'

async function bootstrap() {
  dotenv.config();
  const app = await NestFactory.create(AppModule);
  const cors = require('cors');
  const corsOptions ={
      origin:'http://localhost:3000', 
      credentials:true,            //access-control-allow-credentials:true
      optionSuccessStatus:200
  }
  console.log(process.env.FORTYTWO_CLIENT_ID);
  app.use(cors(corsOptions));
  await app.listen(3001);
}
bootstrap();
