import { MongooseModule } from '@nestjs/mongoose';
import { forwardRef, Module } from '@nestjs/common';
import { MessageService } from './message.service';
import { MessageController } from './message.controller';
import { Message, MessageSchema } from './entities/message.entity';
import { MessageFilterService } from './message-filter.service';
import { BadWordModule } from '../bad-word/bad-word.module';
import { BadWordMessageFilterFactor } from './message-filter-factor/bad-word-message-filter-factor';
import { PhoneNumberMessageFilterFactor } from './message-filter-factor/phone-number-message-filter-factor';
import { UserBanRequestModule } from '../user-ban-request/user-ban-request.module';
import { UserModule } from '../user/user.module';
import { MessageFilterFactorInterface } from './message-filter-factor/message-filter-factor-interface';
import { DuplicateMessageFilterFactor } from './message-filter-factor/duplicate-mesage-filter-factor';
import { ReachLimitMessagesFilterFactor } from './message-filter-factor/reach-limit-messages-filter-factor';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Message.name,
        schema: MessageSchema,
      },
    ]),
    forwardRef(() => UserBanRequestModule),
    forwardRef(() => BadWordModule),
    forwardRef(() => UserModule),
  ],
  controllers: [MessageController],
  providers: [
    MessageService,
    BadWordMessageFilterFactor,
    PhoneNumberMessageFilterFactor,
    DuplicateMessageFilterFactor,
    ReachLimitMessagesFilterFactor,
    {
      provide: 'MessageFilterFactor',
      useFactory: (...messageFilterFactors: MessageFilterFactorInterface[]) =>
        messageFilterFactors,
      inject: [
        BadWordMessageFilterFactor,
        PhoneNumberMessageFilterFactor,
        DuplicateMessageFilterFactor,
        ReachLimitMessagesFilterFactor,
      ],
    },
    MessageFilterService,
  ],
  exports: [MessageService, MessageFilterService],
})
export class MessageModule {}
