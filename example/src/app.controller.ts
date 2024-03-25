import { Controller, Get, Render, Req } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';
import { randomStringGenerator } from '@nestjs/common/utils/random-string-generator.util';
import * as crypto from 'crypto';

const BRAND_AUTH_HASH_ALGORITHM = 'sha1';
const BRAND_AUTH_HASH_DIGEST = 'hex';

@Controller()
export class AppController {
  constructor(private readonly configService: ConfigService) {}

  @Get()
  @Render('index')
  root(@Req() req: Request) {
    if (req.query.userId && req.query.userDisplayName) {
      return {
        chatBoxLibraryUrl: this.configService.get('chatBoxLibraryUrl'),
        chatBoxData: this.getChatBoxesData(req),
      };
    }
  }

  generateToken(chatBoxData) {
    const headerMissingToken = {
      'x-nonce': chatBoxData['xNonce'],
      'x-timestamp': chatBoxData['timestamp'],
      'x-brand-id': chatBoxData['brandId'],
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
        .createHmac(
            BRAND_AUTH_HASH_ALGORITHM,
            this.configService.get('chatBoxSecretKey'),
        )
        .update(requestString)
        .digest(BRAND_AUTH_HASH_DIGEST);
  }

  getChatBoxesData(req: Request) {
    const chatBoxesData = [
      {
        brandId: this.configService.get('brandId'),
        chatName: 'Crypto future trade',
        channelId: 'Future_123',
        channelName: 'Crypto future trade',
        channelRoomId: 'Future-trade',
        channelRoomName: 'Crypto future trade',
        userId: req.query.userId,
        userDisplayName: req.query.userDisplayName,
        timestamp: Date.now(),
        xNonce: randomStringGenerator(),
      },
      {
        brandId: this.configService.get('brandId'),
        chatName: 'Crypto margin trade',
        channelId: 'TAMCHUYEN_456',
        channelName: 'Crypto margin trade',
        channelRoomId: 'TC-TG',
        channelRoomName: 'Room tám chuyện',
        userId: req.query.userId,
        userDisplayName: req.query.userDisplayName,
        timestamp: Date.now(),
        xNonce: randomStringGenerator(),
      },
    ];

    for (const i in chatBoxesData) {
      chatBoxesData[i]['token'] = this.generateToken(chatBoxesData[i]);
    }

    return chatBoxesData;
  }
}
