import { BrandDocument } from '../brand/entities/brand.entity';
import { BrandService } from '../brand/brand.service';
import { Injectable } from '@nestjs/common';
import { Request } from 'express';

@Injectable()
export class BrandAuthService {
  constructor(private readonly brandService: BrandService) {}

  validateRequest(req: Request): Promise<BrandDocument | null> {
    return this.brandService.findOne('63b982a370ee0e49ae4ac8fa');
  }

  getRequestPayload(req: Request): any {
    return {};
  }

  getBrandId(req: Request) {}
}
