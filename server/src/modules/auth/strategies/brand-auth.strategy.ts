import { Injectable, UnauthorizedException } from '@nestjs/common';

import { InitChatDto } from '../../brand-chat/dto/init-chat.dto';
import { BrandAuthService } from '../brand-auth.service';

@Injectable()
export class BrandAuthStrategy {
  constructor(private brandAuthService: BrandAuthService) {}

  async validate(token: string, payload: Partial<InitChatDto>): Promise<any> {
    const brand = await this.brandAuthService.validateBrand(token, payload);
    if (!brand) {
      throw new UnauthorizedException('Invalid brand');
    }
    return brand;
  }
}
