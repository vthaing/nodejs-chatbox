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
import { IpFilter } from 'nestjs-ip-filter';
import { RestrictedIpService } from './modules/restricted-ip/restricted-ip.service';
import { APP_FILTER } from '@nestjs/core';
import { IpFilterDenyExceptionFilter } from './exception/ipfilter-exception-filter.exception';

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
        useDenyException: true,
      }),
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
  providers: [
    AppService,
    {
      provide: APP_FILTER,
      useClass: IpFilterDenyExceptionFilter,
    },
  ],
})
export class AppModule {}
