import { AuthModule } from './modules/auth/auth.module';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MessageModule } from './modules/message/message.module';
import { UserModule } from './modules/user/user.module';
import { ChatModule } from './modules/chat/chat.module';
import { ChannelModule } from './modules/channels/channel.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { BadWordModule } from './modules/bad-word/bad-word.module';
import { RestrictedIpModule } from './modules/restricted-ip/restricted-ip.module';
import configuration from './config/configuration';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
      envFilePath: ['.env.local', '.env'],
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get('mongoDbUrl'),
      }),
      inject: [ConfigService],
    }),
    UserModule,
    MessageModule,
    AuthModule,
    ChatModule,
    ChannelModule,
    BadWordModule,
    RestrictedIpModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
