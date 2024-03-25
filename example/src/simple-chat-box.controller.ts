import { Controller, Get, Render, Req } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { randomStringGenerator } from '@nestjs/common/utils/random-string-generator.util';
import * as crypto from 'crypto';

const BRAND_AUTH_HASH_ALGORITHM = 'sha1';
const BRAND_AUTH_HASH_DIGEST = 'hex';

@Controller()
export class SimpleChatBoxController {
  constructor(private readonly configService: ConfigService) {}

  @Get('simple-chat-box')
  @Render('simple-chat-box')
  root() {
    const chatBoxData = this.getChatBoxData();

    const requestToken = this.generateToken(
      this.configService.get('brandId'),
      this.configService.get('chatBoxSecretKey'),
      chatBoxData['xNonce'],
      chatBoxData['timestamp'],
    );

    return {
      chatBoxLibraryUrl: this.configService.get('chatBoxLibraryUrl'),
      chatBoxData: {
        ...this.getChatBoxData(),
        token: requestToken,
      },
    };
  }

  generateToken(brandId, secretKey, xNonce, xTimestamp) {
    const headerMissingToken = {
      'x-nonce': xNonce,
      'x-timestamp': xTimestamp,
      'x-brand-id': brandId,
    };

    const sortedRequestProperties = Object.keys(headerMissingToken)
      .sort()
      .reduce((accumulator, key) => {
        accumulator[key] = headerMissingToken[key];
        return accumulator;
      }, {});
    const requestString = new URLSearchParams(
      sortedRequestProperties,
    ).toString();

    return crypto
      .createHmac(BRAND_AUTH_HASH_ALGORITHM, secretKey)
      .update(requestString)
      .digest(BRAND_AUTH_HASH_DIGEST);
  }

  getChatBoxData() {
    return {
      brandId: this.configService.get('brandId'),
      chatName: 'One88 Góc bàn đề',
      channelId: 'BANDE_123',
      channelName: 'Bàn Đề - One88',
      channelRoomId: 'BD-TG',
      channelRoomName: 'Đài Tiền Giang',
      userId: 'sample-user-id',
      userDisplayName: 'sample-user-display-name',
      timestamp: Date.now(),
      xNonce: randomStringGenerator(),
    };
  }
}
