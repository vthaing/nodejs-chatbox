import { Injectable } from '@nestjs/common';
import { Message, MessageDocument } from './entities/message.entity';
import { BadWordMessageFilterFactor } from './message-filter-factor/bad-word-message-filter-factor';
import { PhoneNumberMessageFilterFactor } from './message-filter-factor/phone-number-message-filter-factor';
import { UserService } from '../user/user.service';

@Injectable()
export class MessageFilterService {
  constructor(
    private badWordMessageFilterFactor: BadWordMessageFilterFactor,
    private phoneNumberMessageFilterFactor: PhoneNumberMessageFilterFactor,
    private userService: UserService,
  ) {}

  async filterAndHandleViolateMessage(
    message: MessageDocument,
  ): Promise<MessageDocument> {
    const userBanRequests = [];

    const badWordBanRequest =
      await this.badWordMessageFilterFactor.filterAndHandleViolateMessage(
        message,
      );
    if (badWordBanRequest) {
      message.userBanRequests.push(badWordBanRequest._id);
      userBanRequests.push(badWordBanRequest);
    }

    const phoneNumberBanRequest =
      await this.phoneNumberMessageFilterFactor.filterAndHandleViolateMessage(
        message,
      );

    if (phoneNumberBanRequest) {
      message.userBanRequests.push(phoneNumberBanRequest._id);
      userBanRequests.push(phoneNumberBanRequest);
    }

    await this.userService.banUserViaUserBanRequests(
      message.from,
      userBanRequests,
    );

    return message.save();
  }
}
