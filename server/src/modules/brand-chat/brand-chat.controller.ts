import { Controller, Post, Body, UseGuards, Patch, Req } from '@nestjs/common';
import { ApiHeaders, ApiParam, ApiTags } from '@nestjs/swagger';
import { InitChatDto } from './dto/init-chat.dto';
import { BrandChatService } from './brand-chat.service';
import { BrandAuthGuard } from '../auth/guards/brand-auth.guard';
import { UpdateUserStatusDto } from './dto/update-user-status.dto';

@ApiTags('Brand Chat')
@ApiHeaders([
  { name: 'x-brand-id', required: true, description: 'The brand ID' },
  { name: 'x-timestamp', required: true, description: 'The timestamp in UTC' },
  {
    name: 'x-nonce',
    required: true,
    description: 'Random string to generate the secure x-token',
  },
  {
    name: 'x-token',
    required: true,
    description:
      'The token generated via brandId, timestamp, xNonce, Secret code of Brand',
  },
])
@UseGuards(BrandAuthGuard)
@Controller('brand-chat')
export class BrandChatController {
  constructor(private readonly brandChatService: BrandChatService) {}

  @Post('init-chat')
  initChat(@Body() initChatDto: InitChatDto) {
    return this.brandChatService.initChat(initChatDto);
  }
  @Patch('update-user-status')
  updateUserStatus(
    @Body() updateUserStatusDto: UpdateUserStatusDto,
    @Req() req,
  ) {
    return this.brandChatService.updateBrandUserStatus(
      updateUserStatusDto,
      req.user,
    );
  }
}
