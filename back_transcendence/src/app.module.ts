import { Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SimpleGetController } from './simple-get.controller';
import { SimplePostController } from './simple-post.controller';
import { Email } from './email.entity';
import { EmailModule } from './Email.module';
import { EmailService } from './services/email.service';
import { SingUpController } from './singup/SingUp.controller';
import { UserModule } from './user_database/user.module';
import { UsersService } from './user_database/user.service';
import { NameSetController } from './choose_name/Nameset.controller';
import { RequestMethod, MiddlewareConsumer } from '@nestjs/common';
import { AuthMiddleware } from './user_database/auth.middleware';
import { UserController } from './user_database/user.controller';
import { LoginController } from './login/Login.controller';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'postgres',
      port: 5432,
      username: 'myuser',
      password: 'mypassword',
      database: 'mydb',
      entities: [Email],
      autoLoadEntities: true,
      synchronize: true,
    }), EmailModule, UserModule],
  controllers: [AppController, SimpleGetController, SimplePostController, SingUpController, NameSetController, UserController, LoginController],
  providers: [AppService, EmailService, UsersService],
})
export class AppModule implements NestModule{
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .forRoutes({ path: 'set-name', method: RequestMethod.POST }, UserController);
  }

}
