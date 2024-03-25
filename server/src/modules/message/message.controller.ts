import { UserDocument } from '../user/entities/user.entity';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  Req,
} from '@nestjs/common';
import { MessageService } from './message.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Request } from 'express';

@ApiBearerAuth()
@ApiTags('Messages')
@UseGuards(JwtAuthGuard)
@Controller('message')
export class MessageController {
  constructor(private readonly messageService: MessageService) {}

  @Post()
  create(@Req() { user }: any, @Body() createMessageDto: CreateMessageDto) {
    createMessageDto.from = (user as UserDocument).id;
    return this.messageService.create(createMessageDto);
  }

  @Get('history/:targetUser')
  findMessages(
    @Req() { user }: { user: UserDocument },
    @Param('targetUser') targetUser: string,
  ) {
    return this.messageService.findAll({
      $or: [
        { from: targetUser, to: user.id },
        { from: user.id, to: targetUser },
      ],
    });
  }

  @Get('conversation/:conversationId')
  findMessagesByConversation(
    @Req() req: Request,
    @Param('conversationId') conversationId: string,
  ) {
    const params: any = {
      conversation: conversationId,
    };
    if (req.query.brandId) {
      params.brandId = { $in: req.query.brandId };
    }
    if (req.query.isPinnedMessage) {
      params.isPinnedMessage = req.query.isPinnedMessage;
    }
    return this.messageService.findAll(params);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.messageService.remove(id);
  }
}
