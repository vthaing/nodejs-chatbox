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
  Patch,
  UseInterceptors,
  UploadedFile,
  ParseFilePipeBuilder,
  Query,
  NotFoundException,
} from '@nestjs/common';
import { MessageService } from './message.service';
import { CreateMessageDto } from './dto/create-message.dto';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Request } from 'express';
import { UpdateMessageDto } from './dto/update-message.dto';
import RoleGuard from '../auth/guards/roles.guard';
import Role from '../user/role.enum';
import { FileInterceptor } from '@nestjs/platform-express';
import { MessageAttachmentDto } from './dto/message-attachment.dto';
import RequestWithUserInterface from '../auth/request-with-user.interface';
import { ChatGateway } from '../chat/chat.gateway';
import { ChatMessage } from './dto/chat-message';
import { MessagePagingDto } from './dto/message-paging.dto';

@ApiBearerAuth()
@ApiTags('Messages')
@UseGuards(JwtAuthGuard)
@Controller('message')
export class MessageController {
  constructor(
    private readonly messageService: MessageService,
    private chatGateway: ChatGateway,
  ) {}
  @UseGuards(RoleGuard(Role.Admin))
  @Post()
  @ApiOkResponse({
    type: ChatMessage,
  })
  create(@Req() { user }: any, @Body() createMessageDto: CreateMessageDto) {
    createMessageDto.from = (user as UserDocument).id;
    return this.messageService
      .create(createMessageDto)
      .then((message) =>
        message.populate(this.messageService.getRequiredRelationProperties()),
      )
      .then((message) => message.transformToChatBoxData());
  }

  @UseGuards(RoleGuard(Role.Admin))
  @Patch(':id')
  @ApiOkResponse({
    type: ChatMessage,
  })
  update(@Param('id') id: string, @Body() updateMessageDto: UpdateMessageDto) {
    return this.messageService
      .update(id, updateMessageDto)
      .then((message) => message.transformToChatBoxData());
  }

  @UseGuards(RoleGuard(Role.Admin))
  @Patch(':id/pin')
  @ApiOkResponse({
    type: ChatMessage,
  })
  pin(@Param('id') id: string) {
    return this.messageService
      .findOne(id)
      .then((message) => {
        message.isPinnedMessage = true;
        return message.save();
      })
      .then((message) => this.chatGateway.emitPinMessageChanged(message));
  }

  @UseGuards(RoleGuard(Role.Admin))
  @Patch(':id/unpin')
  @ApiOkResponse({
    type: ChatMessage,
  })
  unpin(@Param('id') id: string) {
    return this.messageService
      .findOne(id)
      .then((message) => {
        message.isPinnedMessage = false;
        return message.save();
      })
      .then((message) => this.chatGateway.emitPinMessageChanged(message));
  }

  @ApiOkResponse({
    type: [ChatMessage],
    description: 'Get messages of current user with a specific user',
  })
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
  @ApiOkResponse({
    type: [ChatMessage],
    description: 'Get messages of a conversation',
  })
  async findMessagesByConversation(
    @Req() req: Request,
    @Param('conversationId') conversationId: string,
    @Query() query: MessagePagingDto,
  ) {
    const params: any = {
      conversation: conversationId,
    };
    let limit = query.limit;

    if (query.brandId) {
      params.brandId = { $in: req.query.brandId };
    }
    if (query.isPinnedMessage) {
      params.isPinnedMessage = req.query.isPinnedMessage;
    }
    if (query.beforeMessageId) {
      const beforeMessage = await this.messageService.findOne(
        query.beforeMessageId,
      );
      if (beforeMessage) {
        params.createdAt = { $lt: beforeMessage.createdAt };
        params._id = { $ne: beforeMessage.id };
      } else {
        throw new NotFoundException('Before message not found');
      }
    }

    if (query.fromMessageId) {
      const fromMessage = await this.messageService.findOne(
        query.fromMessageId,
      );
      if (fromMessage) {
        params.createdAt = { $gte: fromMessage.createdAt };
      } else {
        throw new NotFoundException('From message not found');
      }
      if (query.beforeMessageId) {
        limit = null;
      }
    }
    return this.messageService.getMessagesForChatBoxClient(params, limit);
  }

  @UseGuards(RoleGuard(Role.Admin))
  @Delete(':id')
  @ApiOkResponse({
    type: ChatMessage,
  })
  remove(@Param('id') id: string) {
    return this.messageService
      .remove(id)
      .then((message) => this.chatGateway.emitMessageDeleted(message));
  }

  @UseInterceptors(FileInterceptor('file'))
  @Post(':id/upload-attachment')
  @ApiBody({
    required: true,
    type: MessageAttachmentDto,
  })
  @ApiConsumes('multipart/form-data')
  async uploadFile(
    @UploadedFile(
      new ParseFilePipeBuilder()
        .addFileTypeValidator({
          fileType: 'jpg|jpeg|gif|png|pdf',
        })
        .addMaxSizeValidator({
          maxSize: 10000000, //10 MB
        })
        .build(),
    )
    file: Express.Multer.File,
    @Param('id') id: string,
    @Body() messageAttachmentDto: MessageAttachmentDto,
    @Req() req: RequestWithUserInterface,
  ) {
    const mediaItem = await this.messageService.attachMediaItem(
      id,
      req.user.id,
      file,
      messageAttachmentDto.uid,
    );

    await this.chatGateway.emitMediaItemUploaded(mediaItem);

    return mediaItem.id;
  }
}
