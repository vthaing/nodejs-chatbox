import { Injectable } from '@nestjs/common';
import { MessageDocument } from '../entities/message.entity';
import { UserBanRequestDocument } from '../../user-ban-request/entities/user-ban-request.entity';
import { MessageFilterFactorInterface } from './message-filter-factor-interface';
import { UserBanRequestService } from '../../user-ban-request/user-ban-request.service';

@Injectable()
export class PhoneNumberMessageFilterFactor
  implements MessageFilterFactorInterface
{
  constructor(private userBanRequestService: UserBanRequestService) {}
  private phoneNumberRegex = /(?:[-+() ]*\d){10,13}/g;

  async filterAndHandleViolateMessage(
    message: MessageDocument,
  ): Promise<UserBanRequestDocument | null> {
    const phoneNumbers = [...message.text.matchAll(this.phoneNumberRegex)].map(
      (phoneNumberObj) => phoneNumberObj[0].trim(),
    );
    if (phoneNumbers.length === 0) {
      return null;
    }

    message.maskedText = this.cleanPhoneNumbers(message.text, phoneNumbers);
    return this.userBanRequestService.createPhoneNumberUserBanRequest(
      message,
      phoneNumbers,
    );
  }

  stars(key) {
    let keyReplacement = '';

    for (let i = 0; i < key.length; i++) {
      keyReplacement += '*';
    }

    return keyReplacement;
  }

  cleanPhoneNumbers(text: string, phoneNumbers: string[]): string {
    let keyReplacement;

    for (const phoneNumberIndex in phoneNumbers) {
      let index = text.indexOf(phoneNumbers[phoneNumberIndex]);

      while (index !== -1) {
        keyReplacement = this.stars(phoneNumbers[phoneNumberIndex]);

        text =
          text.substring(0, index) +
          keyReplacement +
          text.substring(index + phoneNumbers[phoneNumberIndex].length);
        index = text.indexOf(phoneNumbers[phoneNumberIndex]);
      }
      return text;
    }

    return text;
  }
}
