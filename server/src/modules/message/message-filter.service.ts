import { Injectable } from '@nestjs/common';
import { Message, MessageDocument } from './entities/message.entity';
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
    const badWordBanRequest =
      await this.badWordMessageFilterFactor.filterAndHandleViolateMessage(
        message,
      );
    if (badWordBanRequest) {
      message.userBanRequests.push(badWordBanRequest._id);
    }

    const phoneNumberBanRequest =
      await this.phoneNumberMessageFilterFactor.filterAndHandleViolateMessage(
        message,
      );

    if (phoneNumberBanRequest) {
      message.userBanRequests.push(phoneNumberBanRequest._id);
    }

    return message.save();
  }
}
