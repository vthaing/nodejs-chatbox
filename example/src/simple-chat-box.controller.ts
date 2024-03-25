import {
  Controller,
  Get,
  Patch,
  Param,
  Render,
  Body,
  Res,
  Post,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { randomStringGenerator } from '@nestjs/common/utils/random-string-generator.util';
import * as crypto from 'crypto';
import { UpdateUserDto } from './update-user.dto';
import axios from 'axios';
import { Response, response } from 'express';

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

    console.log('requestToken', requestToken);

    return {
      chatBoxLibraryUrl: this.configService.get('chatBoxLibraryUrl'),
      chatBoxData: {
        ...chatBoxData,
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

    console.log('sortedRequestProperties', sortedRequestProperties);
    const requestString = new URLSearchParams(
      sortedRequestProperties,
    ).toString();

    console.log('requestString', requestString);

    return crypto
      .createHmac(BRAND_AUTH_HASH_ALGORITHM, secretKey)
      .update(requestString)
      .digest(BRAND_AUTH_HASH_DIGEST);
  }

  @Post('update-brand-user/:id')
  updateUser(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
    @Res() res: Response,
  ) {
    const displayName = updateUserDto.displayName;
    const status = updateUserDto.status;

    const xBrandId = this.configService.get('brandId');
    const secretKey = this.configService.get('chatBoxSecretKey');
    const xNonce = randomStringGenerator();
    const xTimeStamp = Date.now();
    const requestToken = this.generateToken(
      xBrandId,
      secretKey,
      xNonce,
      xTimeStamp,
    );

    return axios
      .patch(
        this.configService.get('chatBoxApiBaseUrl') + 'brand-chat/user/' + id,
        {
          displayName: displayName,
          status: status,
        },
        {
          headers: {
            'x-brand-id': xBrandId,
            'x-timestamp': xTimeStamp,
            'x-nonce': xNonce,
            'x-token': requestToken,
            'Content-Type': 'application/json',
          },
        },
      )
      .catch((error) => {
        return error.toJSON();
      })
      .then((response) => {
        if (response.status !== 200) {
          return res.send(JSON.stringify(response));
        }
        return res.redirect('/simple-chat-box');
      });
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
