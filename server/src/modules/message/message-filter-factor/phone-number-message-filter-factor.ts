import { Injectable } from '@nestjs/common';
import { MessageDocument } from '../entities/message.entity';
import { UserBanRequestDocument } from '../../user-ban-request/entities/user-ban-request.entity';

@Injectable()
export class PhoneNumberMessageFilterFactor {
  async filterAndHandleViolateMessage(
    message: MessageDocument,
  ): Promise<UserBanRequestDocument | null> {
    return null;
  }
}
