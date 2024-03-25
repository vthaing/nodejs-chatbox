import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { InitChatDto } from './dto/init-chat.dto';
import { BrandChatService } from './brand-chat.service';
import { BrandAuthGuard } from '../auth/guards/brand-auth.guard';

@ApiBearerAuth()
@ApiTags('Brand Chat')
@UseGuards(BrandAuthGuard)
@Controller('brand-chat')
export class BrandChatController {
  constructor(private readonly brandChatService: BrandChatService) {}

  @Post('init-chat')
  initChat(@Body() initChatDto: InitChatDto) {
    return this.brandChatService.initChat(initChatDto);
  }
}
