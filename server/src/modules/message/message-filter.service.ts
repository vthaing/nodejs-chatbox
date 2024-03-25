import { Injectable } from '@nestjs/common';
import { BadWordService } from '../bad-word/bad-word.service';
import { Message, MessageDocument } from './entities/message.entity';
import { BadWord, BadWordDocument } from '../bad-word/entities/bad-word.entity';
import { BadWordMessageFilterFactor } from './message-filter-factor/bad-word-message-filter-factor';
import { PhoneNumberMessageFilterFactor } from './message-filter-factor/phone-number-message-filter-factor';

@Injectable()
export class MessageFilterService {
  constructor(
    private badWordMessageFilterFactor: BadWordMessageFilterFactor,
    private phoneNumberMessageFilterFactor: PhoneNumberMessageFilterFactor,
  ) {}

  async filterAndHandleViolateMessage(
    message: MessageDocument,
  ): Promise<Message> {
    await this.badWordMessageFilterFactor.filterAndHandleViolateMessage(
      message,
    );

    await this.phoneNumberMessageFilterFactor.filterAndHandleViolateMessage(
      message,
    );

    return message.save();
  }
}
