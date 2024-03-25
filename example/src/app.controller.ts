import { Controller, Get, Render } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Controller()
export class AppController {
  constructor(private readonly configService: ConfigService) {}

  @Get()
  @Render('index')
  root() {
    return {
      message: 'Hello world!',
      brandId: this.configService.get('brandId'),
      chatBoxLibraryUrl: this.configService.get('chatBoxLibraryUrl'),
    };
  }
}
