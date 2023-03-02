import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cors from 'cors';
import * as dotenv from 'dotenv'
import { createProxyMiddleware } from 'http-proxy-middleware';

async function bootstrap() {
  dotenv.config();
  const app = await NestFactory.create(AppModule);
  const cors = require('cors');
  const corsOptions ={
    origin: ['http://localhost:3000', 'http://api.intra.42.fr'], 
      credentials:true,            //access-control-allow-credentials:true
      optionSuccessStatus:200
  }
  /*
  const proxy = createProxyMiddleware('/auth/42', {
    target: 'https://api.intra.42.fr',
    changeOrigin: true,
    headers: {
      'Access-Control-Allow-Origin': '*'
    }
  });
  app.use(proxy);
  */
  app.use(cors(corsOptions));
  await app.listen(3001);
}
bootstrap();
