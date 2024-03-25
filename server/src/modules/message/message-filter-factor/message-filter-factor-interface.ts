import { MessageDocument } from '../entities/message.entity';
import { UserBanRequestDocument } from '../../user-ban-request/entities/user-ban-request.entity';

export interface MessageFilterFactorInterface {
  filterAndHandleViolateMessage(
    message: MessageDocument,
  ): Promise<UserBanRequestDocument | null>;
}
