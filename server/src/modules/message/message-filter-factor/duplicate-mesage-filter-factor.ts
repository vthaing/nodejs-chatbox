import { Injectable } from '@nestjs/common';
import { MessageDocument } from '../entities/message.entity';
import { UserBanRequestDocument } from '../../user-ban-request/entities/user-ban-request.entity';
import { MessageFilterFactorInterface } from './message-filter-factor-interface';
import { UserBanRequestService } from '../../user-ban-request/user-ban-request.service';
import { MessageService } from '../message.service';
import { UserBanRequestConfig } from '../../user-ban-request/user-ban-request-config';

@Injectable()
export class DuplicateMessageFilterFactor
  implements MessageFilterFactorInterface
{
  constructor(
    private userBanRequestService: UserBanRequestService,
    private messageService: MessageService,
  ) {}

  async filterAndHandleViolateMessage(
    message: MessageDocument,
  ): Promise<UserBanRequestDocument | null> {
    return this.findDuplicatedMessage(message)
      .then((duplicatedMessage) => {
        if (duplicatedMessage) {
          return this.userBanRequestService.createDuplicatedMessageUserBanRequest(
            message,
            duplicatedMessage,
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

  findDuplicatedMessage(
    message: MessageDocument,
  ): Promise<MessageDocument | null> {
    const timeCondition = new Date();
    timeCondition.setMinutes(
      timeCondition.getMinutes() -
        UserBanRequestConfig.getDuplicatedMessageTimeLimitMinutes(),
    );
    return this.messageService.findOneBy({
      text: message.text,
      _id: { $ne: message.id },
      created: { $gte: timeCondition },
    });
  }
}
