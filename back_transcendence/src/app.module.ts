import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SimpleGetController } from './simple-get.controller';
import { SimplePostController } from './simple-post.controller';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'postgres',
      port: 5432,
      username: 'myuser',
      password: 'mypassword',
      database: 'mydb',
      autoLoadEntities: true,
      synchronize: true,
    }),
  ],
  controllers: [AppController, SimpleGetController, SimplePostController],
  providers: [AppService],
})
export class AppModule {}
