import { Module } from '@nestjs/common';
import { MessageModule } from './../message/message.module';
import { UserModule } from './../user/user.module';
import { AuthModule } from './../auth/auth.module';
import { ChatGateway } from './chat.gateway';
import { ConversationModule } from '../conversation/conversation.module';

@Module({
  providers: [ChatGateway],
  imports: [AuthModule, UserModule, MessageModule, ConversationModule],
})
export class ChatModule {}
