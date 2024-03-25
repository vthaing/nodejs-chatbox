import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
} from '@nestjs/common';
import { ConversationService } from './conversation.service';
import { CreateConversationDto } from './dto/create-conversation.dto';
import { UpdateConversationDto } from './dto/update-conversation.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { Request } from 'express';

@ApiBearerAuth()
@ApiTags('Conversation')
@UseGuards(JwtAuthGuard)
@Controller('conversations')
export class ConversationController {
  constructor(private readonly conversationService: ConversationService) {}

  @Post()
  create(@Body() createConversationDto: CreateConversationDto) {
    return this.conversationService.create(createConversationDto);
  }

  @Get()
  findAll(@Req() req: Request) {
    const params: any = {};
    if (req.query.id) {
      params._id = { $in: req.query.id };
    }
    if (req.query.brandId) {
      params.brandId = { $in: req.query.brandId };
    }
    return this.conversationService.findAll(params);
  }

  //@TODO: should move this route to the user module. The URL should be: user/:userId/conversation
  @Get('user-conversation/:userId')
  findAllUserConversations(@Param('userId') userId: string) {
    return this.conversationService.findAll({ members: { $all: [userId] } });
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.conversationService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateConversationDto: UpdateConversationDto,
  ) {
    return this.conversationService.update(id, updateConversationDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.conversationService.remove(id);
  }
}
