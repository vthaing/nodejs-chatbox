import { BrandDocument } from '../brand/entities/brand.entity';
import { BrandService } from '../brand/brand.service';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Request } from 'express';
import * as crypto from 'crypto';

const BRAND_AUTH_HASH_ALGORITHM = 'sha1';
const BRAND_AUTH_HASH_DIGEST = 'hex';

@Injectable()
export class BrandAuthService {
  constructor(private readonly brandService: BrandService) {}

  async validateBrandAuthRequest(req: Request): Promise<BrandDocument | null> {
    if (!this.validateRequestData(req)) {
      return null;
    }
    const brand = await this.brandService.findOne(this.getRequestBrandId(req));
    if (!brand) {
      return null;
    }

    if (!brand.enabled) {
      console.warn(
        `Brand ${brand.name} (${brand.id}) has been disabled but still have request from it`,
      );
      return null;
    }

    return brand;
  }

  validateToken(req, brand: BrandDocument): boolean {
    const requestToken = this.getRequestToken(req);
    const systemGeneratedToken = this.generateToken(req, brand);

    return requestToken === systemGeneratedToken;
  }

  validateRequestData(req: Request) {
    if (!req.is('application/json')) {
      throw new UnauthorizedException('Unsupported content type');
    }

    if (!this.getRequestBrandId(req)) {
      throw new UnauthorizedException('Invalid brand');
    }

    if (!this.getRequestToken(req)) {
      throw new UnauthorizedException('Invalid Token');
    }

    const timeStamp = this.getRequestTimestamp(req);
    if (!timeStamp) {
      throw new UnauthorizedException('Invalid Timestamp');
    }

    if (!this.getRequestNonce(req)) {
      throw new UnauthorizedException('Invalid X-nonce');
    }

    return true;
  }

  getRequestPayload(req: Request): any {
    return { ...req.query, ...req.body };
  }

  getRequestBrandId(req: Request): string | null {
    return req.headers['X-Brand-Id']?.toString();
  }

  getRequestTimestamp(req: Request): string | null {
    return req.headers['X-Timestamp']?.toString();
  }

  getRequestToken(req: Request): string | null {
    return req.headers['X-Token']?.toString();
  }

  getRequestNonce(req: Request): string | null {
    return req.headers['X-Nonce']?.toString();
  }

  generateToken(req, brand: BrandDocument): string {
    const requestProperties = {
      ...this.getRequestPayload(req),
      'X-nonce': this.getRequestNonce(req),
      'X-Timestamp': this.getRequestTimestamp(req),
      'X-Brand-Id': this.getRequestBrandId(req),
    };
    const sortedRequestProperties = Object.keys(requestProperties)
      .sort()
      .reduce((accumulator, key) => {
        accumulator[key] = requestProperties[key];

        return accumulator;
      }, {});
    const requestString = new URLSearchParams(
      sortedRequestProperties,
    ).toString();

    return crypto
      .createHmac(BRAND_AUTH_HASH_ALGORITHM, brand.secretKey)
      .update(requestString)
      .digest(BRAND_AUTH_HASH_DIGEST);
  }
}
