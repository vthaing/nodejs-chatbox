import { Injectable } from '@nestjs/common';
import { Message, MessageDocument } from '../entities/message.entity';

@Injectable()
export class PhoneNumberMessageFilterFactor {
  async filterAndHandleViolateMessage(
    message: MessageDocument,
  ): Promise<Message> {
    return message;
  }
}
