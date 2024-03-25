import { Controller, Get, Render, Req } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';
import { randomStringGenerator } from '@nestjs/common/utils/random-string-generator.util';

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

  generateToken(chatBoxData) {}

  getChatBoxesData(req: Request) {
    return [
      {
        brandId: this.configService.get('brandId'),
        secretKey: this.configService.get('chatBoxSecretKey'),
        chatName: 'Crypto future trade',
        channelId: 'Future_123',
        channelName: 'Crypto future trade',
        channelRoomId: 'Future-trade',
        channelRoomName: 'Crypto future trade',
        userId: req.query.userId,
        userDisplayName: req.query.userDisplayName,
        timestamp: Date.now() / 1000,
        xNonce: randomStringGenerator(),
        token: 'sdsdsd',
      },
      {
        brandId: this.configService.get('brandId'),
        secretKey: this.configService.get('chatBoxSecretKey'),
        chatName: 'Crypto margin trade',
        channelId: 'TAMCHUYEN_456',
        channelName: 'Crypto margin trade',
        channelRoomId: 'TC-TG',
        channelRoomName: 'Room tám chuyện',
        userId: req.query.userId,
        userDisplayName: req.query.userDisplayName,
        timestamp: Date.now() / 1000,
        xNonce: randomStringGenerator(),
        token: 'sdsdsd',
      },
    ];
  }
}
