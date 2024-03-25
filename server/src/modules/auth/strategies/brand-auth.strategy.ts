import { Injectable, UnauthorizedException } from '@nestjs/common';

import { BrandAuthService } from '../brand-auth.service';
import { Strategy } from 'passport-custom';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';

@Injectable()
export class BrandAuthStrategy extends PassportStrategy(
  Strategy,
  'brand-auth',
) {
  constructor(private brandAuthService: BrandAuthService) {
    super();
  }

  validate(req: Request): Promise<any> {
    return this.brandAuthService.validateBrandAuthRequest(req);
  }
}
