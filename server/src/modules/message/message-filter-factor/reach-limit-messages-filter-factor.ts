import { Injectable } from '@nestjs/common';
import { MessageDocument } from '../entities/message.entity';
import { UserBanRequestDocument } from '../../user-ban-request/entities/user-ban-request.entity';
import { MessageFilterFactorInterface } from './message-filter-factor-interface';
import { UserBanRequestService } from '../../user-ban-request/user-ban-request.service';
import { MessageService } from '../message.service';
import { UserBanRequestConfig } from '../../user-ban-request/user-ban-request-config';

@Injectable()
export class ReachLimitMessagesFilterFactor
  implements MessageFilterFactorInterface
{
  constructor(
    private userBanRequestService: UserBanRequestService,
    private messageService: MessageService,
  ) {}

  async filterAndHandleViolateMessage(
    message: MessageDocument,
  ): Promise<UserBanRequestDocument | null> {
    return this.getOldMessages(message)
      .then((oldMessages) => {
        if (oldMessages.length > 0) {
          return this.userBanRequestService.createReachLimitMessagesUserBanRequest(
            message,
            oldMessages,
          );
        }
        return null;
      })
      .then((userBanRequest) => {
        if (userBanRequest) {
          message.maskedText = this.stars(message.text);
        }
        return userBanRequest;
      });
  }

  stars(text) {
    let keyReplacement = '';

    for (let i = 0; i < text.length; i++) {
      keyReplacement += '*';
    }

    return keyReplacement;
  }

  getOldMessages(message: MessageDocument): Promise<MessageDocument[]> {
    const timeCondition = new Date();
    timeCondition.setSeconds(
      timeCondition.getSeconds() -
        UserBanRequestConfig.getReachLimitMessageTimeSeconds(),
    );

    return this.messageService.findAll({
      _id: { $ne: message.id },
      from: message.from,
      createdAt: { $gte: timeCondition },
    });
  }
}
