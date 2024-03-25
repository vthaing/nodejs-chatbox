import { forwardRef, Module } from '@nestjs/common';
import { MessageModule } from '../message/message.module';
import { UserModule } from '../user/user.module';
import { AuthModule } from '../auth/auth.module';
import { ChatGateway } from './chat.gateway';
import { ConversationModule } from '../conversation/conversation.module';

@Module({
  providers: [ChatGateway],
  imports: [
    forwardRef(() => AuthModule),
    forwardRef(() => UserModule),
    forwardRef(() => MessageModule),
    forwardRef(() => ConversationModule),
  ],
  exports: [ChatGateway],
})
export class ChatModule {}
