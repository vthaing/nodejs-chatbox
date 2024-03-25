import { Controller, Post, Body } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { InitChatDto } from './dto/init-chat.dto';
import { BrandChatService } from './brand-chat.service';

@ApiBearerAuth()
@ApiTags('Brands')
@Controller('brands')
export class BrandChatController {
  constructor(private readonly brandChatService: BrandChatService) {}

  @Post('init-chat')
  initChat(@Body() initChatDto: InitChatDto) {
    //return this.brandService.create(initChatDto);
  }
}
