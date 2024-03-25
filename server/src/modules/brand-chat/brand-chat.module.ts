import { forwardRef, Module } from '@nestjs/common';
import { BrandChatController } from './brand-chat.controller';
import { AuthModule } from '../auth/auth.module';
import { UserModule } from '../user/user.module';
import { BrandModule } from '../brand/brand.module';
import { BrandChannelModule } from '../brand-channel/brand-channel.module';
import { BrandRoomModule } from '../brand-room/brand-room.module';
import { ConversationModule } from '../conversation/conversation.module';
import { BrandChatService } from './brand-chat.service';

@Module({
  imports: [
    AuthModule,
    forwardRef(() => UserModule),
    forwardRef(() => BrandModule),
    forwardRef(() => BrandChannelModule),
    forwardRef(() => BrandRoomModule),
    forwardRef(() => ConversationModule),
  ],
  controllers: [BrandChatController],
  providers: [BrandChatService],
  exports: [BrandChatService],
})
export class BrandChatModule {}
