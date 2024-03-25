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
} from '@nestjs/common';
import { MessageService } from './message.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { UpdateMessageDto } from './dto/update-message.dto';
import RoleGuard from '../auth/guards/roles.guard';
import Role from '../user/role.enum';
import { FileInterceptor } from '@nestjs/platform-express';

@ApiBearerAuth()
@ApiTags('Messages')
@UseGuards(JwtAuthGuard)
@Controller('message')
export class MessageController {
  constructor(private readonly messageService: MessageService) {}
  @UseGuards(RoleGuard(Role.Admin))
  @Post()
  create(@Req() { user }: any, @Body() createMessageDto: CreateMessageDto) {
    createMessageDto.from = (user as UserDocument).id;
    return this.messageService.create(createMessageDto);
  }

  @UseGuards(RoleGuard(Role.Admin))
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateMessageDto: UpdateMessageDto) {
    return this.messageService.update(id, updateMessageDto);
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

  @UseGuards(RoleGuard(Role.Admin))
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.messageService.remove(id);
  }

  @UseInterceptors(FileInterceptor('file'))
  @Post(':id/upload-attachment')
  uploadFile(@UploadedFile() file: Express.Multer.File) {
    console.log(file, 'sdsdsdsdhhhohoasidasdsadads');
    // return {
    //   file: file.buffer.toString(),
    // };
    return 'ok';
  }
}
