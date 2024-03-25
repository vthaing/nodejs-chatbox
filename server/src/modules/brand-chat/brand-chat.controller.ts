import { Controller, Post, Body } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { InitChatDto } from './dto/init-chat.dto';
import { BrandChatService } from './brand-chat.service';

@ApiBearerAuth()
@ApiTags('Brand Chat')
@Controller('brand-chat')
export class BrandChatController {
  constructor(private readonly brandChatService: BrandChatService) {}

  @Post('init-chat')
  initChat(@Body() initChatDto: InitChatDto) {
    return this.brandChatService.initChat(initChatDto);
  }
}
