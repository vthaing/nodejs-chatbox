import { AuthModule } from './modules/auth/auth.module';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MessageModule } from './modules/message/message.module';
import { UserModule } from './modules/user/user.module';
import { ChatModule } from './modules/chat/chat.module';
import { ChannelsModule } from './modules/channels/channelsModule';

@Module({
  imports: [
    MongooseModule.forRoot(
      'mongodb://chat_user:12345678@localhost:3007/test?authSource=admin&readPreference=primary&appname=MongoDB%20Compass&ssl=false',
      {
        //@TODO: temporary disable because they are not support
        // useCreateIndex: true,
        // useFindAndModify: false,
      },
    ),
    UserModule,
    MessageModule,
    AuthModule,
    ChatModule,
    ChannelsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
