import { MongooseModule } from '@nestjs/mongoose';
import {forwardRef, Module} from '@nestjs/common';
import { MessageService } from './message.service';
import { MessageController } from './message.controller';
import { Message, MessageSchema } from './entities/message.entity';
import { AuthModule } from '../auth/auth.module';
import { MessageFilterService } from './message-filter.service';
import { BadWordModule } from '../bad-word/bad-word.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Message.name,
        schema: MessageSchema,
      },
    ]),
    AuthModule,
    forwardRef(() => BadWordModule),
  ],
  controllers: [MessageController],
  providers: [MessageService, MessageFilterService],
  exports: [MessageService, MessageFilterService],
})
export class MessageModule {}
