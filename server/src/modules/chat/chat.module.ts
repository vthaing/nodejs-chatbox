import { Module } from '@nestjs/common';
import { MessageModule } from './../message/message.module';
import { UserModule } from './../user/user.module';
import { AuthModule } from './../auth/auth.module';
import { ChatGateway } from './chat.gateway';
import { ChannelModule } from '../channels/channel.module';

@Module({
  providers: [ChatGateway],
  imports: [AuthModule, UserModule, MessageModule, ChannelModule],
})
export class ChatModule {}
