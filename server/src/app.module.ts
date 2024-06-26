import { AuthModule } from './modules/auth/auth.module';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MessageModule } from './modules/message/message.module';
import { UserModule } from './modules/user/user.module';
import { ChatModule } from './modules/chat/chat.module';
import { ConversationModule } from './modules/conversation/conversation.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { BadWordModule } from './modules/bad-word/bad-word.module';
import { RestrictedIpModule } from './modules/restricted-ip/restricted-ip.module';
import configuration from './config/configuration';
import { RestrictedIpService } from './modules/restricted-ip/restricted-ip.service';
import { APP_FILTER } from '@nestjs/core';
import { IpFilterDenyExceptionFilter } from './exception/ipfilter-exception-filter.exception';
import { UserBanRequestModule } from './modules/user-ban-request/user-ban-request.module';
import { BrandModule } from './modules/brand/brand.module';
import { BrandChannelModule } from './modules/brand-channel/brand-channel.module';
import { BrandRoomModule } from './modules/brand-room/brand-room.module';
import { BrandChatModule } from './modules/brand-chat/brand-chat.module';
import { ClientScriptModule } from './modules/client-script/client-script.module';
import { MediaModule } from './modules/media-item/media.module';
import { DriverType, StorageModule } from '@codebrew/nestjs-storage';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { IpFilter } from './modules/ip-filter/ipfilter.module';

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
    IpFilter.registerAsync({
      imports: [RestrictedIpModule],
      inject: [RestrictedIpService],
      useFactory: async (restrictedIpService: RestrictedIpService) => ({
        blacklist: await restrictedIpService.getAllRestrictedIps(),
        whitelist: ['.*'],
        useDenyException: true,
      }),
    }),
    StorageModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        default: 'local',
        disks: {
          local: {
            driver: DriverType.LOCAL,
            config: {
              root: configService.get('messageAttachmentPath'),
            },
          },
        },
      }),
      inject: [ConfigService],
    }),
    UserModule,
    MessageModule,
    AuthModule,
    ChatModule,
    ConversationModule,
    BadWordModule,
    RestrictedIpModule,
    UserBanRequestModule,
    BrandModule,
    BrandChannelModule,
    BrandRoomModule,
    BrandChatModule,
    ClientScriptModule,
    MediaModule,
    EventEmitterModule.forRoot(),
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_FILTER,
      useClass: IpFilterDenyExceptionFilter,
    },
  ],
})
export class AppModule {}
