import { Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user_database/user.module';
import { UsersService } from './user_database/user.service';
import { NameSetController } from './choose_name/Nameset.controller';
import { RequestMethod, MiddlewareConsumer } from '@nestjs/common';
import { AuthMiddleware } from './user_database/auth.middleware';
import { UserController } from './user_database/user.controller';
import { ChatGateway } from './chat/chat.gateway';
import { ChatRoomController } from './ChatRoom_database/ChatRoom.controller';
import { ChatRoomService } from './ChatRoom_database/ChatRoom.service';
import { ChatRoomModule } from './ChatRoom_database/ChatRoom.module';
import { MessageModule } from './ChatRoom_database/Message.module';
import { MessageService } from './ChatRoom_database/Message.service';
import { UsersInformationController } from './user_database/usersinformation.controller';
import { ChatRoomControllerNew } from './ChatRoom_database/ChatRoomNew.controller';
import { ImageController } from './image/image.controller';
import { ImageService } from './image/image.service';
import { ImageModule } from './image/image.module';
import { MulterModule } from '@nestjs/platform-express';
import { PublicImageController } from './image/publicimage.controller';
import { GameGateway} from './GamesDatabase/gamewebsocket/game.gateway';
import { GamesServices } from './GamesDatabase/Games.service';
import { GamesController } from './GamesDatabase/Games.controller';
import { GameModule } from './GamesDatabase/Games.module';
import { NotificationGateway } from './notification/notification.gateway';
import { NotificationService } from './notification/notification.service';
import { AuthModule } from './auth42/auth.module';
import { AuthController } from './auth42/auth.controller';
import { FortyTwoStrategy } from './auth42/fortytwo.strategy';
import { MailModule } from './mail/mail.module';
import { LoginController } from './TestLogin/Login.controller';


@Module({
  imports: [
    MulterModule.register({ dest: './uploads' }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'postgres',
      port: 5432,
      username: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASSWORD,
      database:  process.env.POSTGRES_DB,
      autoLoadEntities: true,
      synchronize: true,
    }), MailModule, UserModule, ChatRoomModule, MessageModule, ImageModule, GameModule , AuthModule],
  controllers: [AppController, LoginController, NameSetController, UserController, AuthController, ChatRoomController, ChatRoomControllerNew, UsersInformationController, ImageController, PublicImageController, GamesController],
  providers: [FortyTwoStrategy , AppService, UsersService, ChatRoomService, ChatGateway, MessageService, ImageService, GameGateway, GamesServices, NotificationGateway, NotificationService],
})
export class AppModule implements NestModule{
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .forRoutes({ path: 'set-name', method: RequestMethod.POST }, UserController, ChatRoomControllerNew, ImageController);
    }

}
