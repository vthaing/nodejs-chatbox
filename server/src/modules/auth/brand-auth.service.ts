import { InitChatDto } from '../brand-chat/dto/init-chat.dto';
import { BrandDocument } from '../brand/entities/brand.entity';

export class BrandAuthService {
  validateBrand(
    token: string,
    payload: Partial<InitChatDto>,
  ): Promise<Pick<BrandDocument, 'id' & 'name' & 'status'> | null> {
    return null;
  }
}
