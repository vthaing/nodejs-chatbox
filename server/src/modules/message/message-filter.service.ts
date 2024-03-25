import { Inject, Injectable } from '@nestjs/common';
import { MessageDocument } from './entities/message.entity';
import { UserService } from '../user/user.service';
import { MessageFilterFactorInterface } from './message-filter-factor/message-filter-factor-interface';

@Injectable()
export class MessageFilterService {
  constructor(
    @Inject('MessageFilterFactor')
    private messageFilterFactors: MessageFilterFactorInterface[],
    private userService: UserService,
  ) {}

  async filterAndHandleViolateMessage(
    message: MessageDocument,
  ): Promise<MessageDocument> {
    const userBanRequests = [];

    for (const messageFilterFactor of this.messageFilterFactors) {
      const userBanRequest =
        await messageFilterFactor.filterAndHandleViolateMessage(message);
      if (userBanRequest) {
        message.userBanRequests.push(userBanRequest._id);
        userBanRequests.push(userBanRequest);
      }
    }

    if (userBanRequests.length > 0) {
      await this.userService.banUserViaUserBanRequests(
        message.from,
        userBanRequests,
      );
    }

    return message.save();
  }
}
