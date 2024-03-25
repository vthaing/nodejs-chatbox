import { Module } from '@nestjs/common';
import { BrandChatController } from './brand-chat.controller';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    AuthModule,
  ],
  controllers: [BrandChatController],
  providers: [],
  exports: [],
})
export class BrandChatModule {}
