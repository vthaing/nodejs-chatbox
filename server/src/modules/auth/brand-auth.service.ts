import { BrandDocument } from '../brand/entities/brand.entity';
import { BrandService } from '../brand/brand.service';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Request } from 'express';
import * as crypto from 'crypto';
import {UserAuthInterface} from "./UserAuthInterface";

const BRAND_AUTH_HASH_ALGORITHM = 'sha1';
const BRAND_AUTH_HASH_DIGEST = 'hex';

@Injectable()
export class BrandAuthService {
  constructor(private readonly brandService: BrandService) {}

  async validateBrandAuthRequest(
    req: Request,
  ): Promise<UserAuthInterface | null> {
    if (!this.validateRequestData(req)) {
      throw new UnauthorizedException('Invalid brand auth request');
    }
    const brand = await this.brandService.findOne(this.getRequestBrandId(req));
    if (!brand) {
      throw new UnauthorizedException('Brand is not found');
    }

    if (!brand.enabled) {
      console.warn(
        `Brand ${brand.name} (${brand.id}) has been disabled but still have request from it`,
      );
      throw new UnauthorizedException('Brand is not enabled');
    }

    if (!this.validateToken(req, brand)) {
      console.warn(`Invalid brand auth token`);
      throw new UnauthorizedException('Invalid token');
    }

    return {
      displayName: brand.name,
      id: brand.id,
      online: false,
    } as UserAuthInterface;
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
      throw new UnauthorizedException('Invalid x-nonce');
    }

    return true;
  }

  getRequestPayload(req: Request): any {
    return { ...req.query, ...req.body };
  }

  getRequestBrandId(req: Request): string | null {
    return req.headers['x-brand-id']?.toString();
  }

  getRequestTimestamp(req: Request): string | null {
    return req.headers['x-timestamp']?.toString();
  }

  getRequestToken(req: Request): string | null {
    return req.headers['x-token']?.toString();
  }

  getRequestNonce(req: Request): string | null {
    return req.headers['x-nonce']?.toString();
  }

  generateToken(req, brand: BrandDocument): string {
    const requestProperties = {
      //TODO: Should we use the payload for more secure?
      // ...this.getRequestPayload(req),
      'x-nonce': this.getRequestNonce(req),
      'x-timestamp': this.getRequestTimestamp(req),
      'x-brand-id': this.getRequestBrandId(req),
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
